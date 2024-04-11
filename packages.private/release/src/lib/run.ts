import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { Gitlab } from "@gitbeaker/core";
import {
  checkClean as gitCheckClean,
  commitAll as gitCommitAll,
  push as gitPush,
  pushTags as gitPushTags,
  reset as gitReset,
  switchBranch as gitSwitchBranch,
} from "./git-utils.js";
import { packageNames } from "./package-names.js";
import { readChangesetState } from "./read-changeset-state.js";
import type { Package } from "./types.js";
import { getBumpedPackages, getChangelogEntry, getPackageJson, getVersionsByDirectory } from "./utils.js";

const projectId = process.env.CI_PROJECT_ID!;
const ref = process.env.CI_COMMIT_REF_NAME!;

const createRelease = async (api: Gitlab, { pkg, tagName }: { pkg: Package; tagName: string }) => {
  try {
    const changelogFileName = path.join(pkg.dir, "CHANGELOG.md");

    const changelog = fs.readFileSync(changelogFileName, "utf-8");

    const changelogEntry = getChangelogEntry(changelog, pkg.packageJson.version);

    if (!changelogEntry) {
      // we can find a changelog but not the entry for this version
      // if this is true, something has probably gone wrong
      throw new Error(`Could not find changelog entry for ${pkg.packageJson.name}@${pkg.packageJson.version}`);
    }

    await api.ProjectReleases.create(projectId, {
      name: tagName,
      tag_name: tagName,
      description: changelogEntry.content,
      pre_release: pkg.packageJson.version.includes("-"),
    });
  } catch (err: unknown) {
    // if we can't find a changelog, the user has probably disabled changelogs
    if ((err as { code: string }).code !== "ENOENT") {
      throw err;
    }
  }
};

interface PublishedPackage {
  name: string;
  version: string;
}

type PublishResult = { published: false } | { published: true; publishedPackages: PublishedPackage[] };

export const runPublish = async (api: Gitlab): Promise<PublishResult> => {
  const {
    status: publishStatus,
    signal: publishSignal,
    stdout: publishStdout,
    stderr: publishStderr,
    error: publishError,
  } = spawnSync("pnpm", ["changeset", "publish"], { encoding: "utf-8" });

  console.log(
    `Ran publish script. Status: ${publishStatus ?? "N/A"}, signal: ${publishSignal ?? "N/A"}, stdio:\n${publishStdout || "N/A"}, stderr:\n${
      publishStderr || "N/A"
    }.`,
  );

  if (publishStatus || publishSignal || publishError) {
    console.error("Failed to publish.");
    throw publishError;
  }

  console.log("Published packages.");

  gitPushTags();

  const packages = packageNames.map((packageDirectory) => {
    return {
      packageJson: getPackageJson(packageDirectory),
      dir: packageDirectory,
    } satisfies Package;
  });

  const releasedPackages: Package[] = [];

  const newTagRegex = /New tag:\s+(@[^/]+\/[^@]+|[^/]+)@(\S+)/;
  const packagesByName = new Map(packages.map((x) => [x.packageJson.name, x]));

  for (const line of publishStdout.split("\n")) {
    const match = newTagRegex.exec(line);
    if (match === null) {
      continue;
    }
    const pkgName = match[1];
    const pkg = packagesByName.get(pkgName);
    if (pkg === undefined) {
      throw new Error(`Package "${pkgName}" not found.`);
    }
    releasedPackages.push(pkg);
  }

  if (releasedPackages.length > 0) {
    await Promise.all(
      releasedPackages.map((pkg) =>
        createRelease(api, {
          pkg,
          tagName: `${pkg.packageJson.name}@${pkg.packageJson.version}`,
        }),
      ),
    );
    return {
      published: true,
      publishedPackages: releasedPackages.map((pkg) => ({
        name: pkg.packageJson.name,
        version: pkg.packageJson.version,
      })),
    };
  }

  return { published: false };
};

export const runVersion = async (api: Gitlab) => {
  const currentBranch = ref;
  const versionBranch = `changeset-release/${currentBranch}`;

  const { preState } = await readChangesetState();

  gitSwitchBranch(versionBranch);
  execSync(`git fetch origin "${currentBranch}"`, {
    stdio: "inherit",
  });
  gitReset(`origin/${currentBranch}`);

  const versionsByDirectory = await getVersionsByDirectory();

  execSync("pnpm changeset version", {
    stdio: "inherit",
  });

  const bumpedPackages = await getBumpedPackages(versionsByDirectory);

  const packagesToRelease = bumpedPackages
    .map((pkg) => {
      const changelogContents = fs.readFileSync(path.join(pkg.dir, "CHANGELOG.md"), "utf-8");

      const entry = getChangelogEntry(changelogContents, pkg.packageJson.version);
      return {
        highestLevel: entry.highestLevel,
        private: !!pkg.packageJson.private,
        content: `## ${pkg.packageJson.name}@${pkg.packageJson.version}\n\n${entry.content}`,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.private === b.private) {
        return b.highestLevel - a.highestLevel;
      }
      if (a.private) {
        return 1;
      }
      return -1;
    })
    .map((x) => x.content)
    .join("\n");

  const mrTitle = `chore(packages): publish packages${preState ? ` (${preState.tag})` : ""}`;

  const mrBody = `This MR was opened automatically. When you're ready to do a release, merge this, and the packages will automatically be published to npm. If you're not ready to do a release yet, that's fine, whenever you add more changesets to ${currentBranch}, this MR will be updated.

${preState ? `\`${currentBranch}\` is currently in **pre mode**.` : ""}

# Releases

${packagesToRelease}`;

  if (!gitCheckClean()) {
    gitCommitAll(`chore(packages): publish packages${preState ? ` (${preState.tag})` : ""}`);
  }

  gitPush(versionBranch, { force: true });

  const searchResult = await api.MergeRequests.all({
    projectId,
    state: "opened",
    sourceBranch: versionBranch,
    target_branch: currentBranch,
    maxPages: 1,
    perPage: 1,
  });
  console.log(JSON.stringify(searchResult, null, 2));
  if (searchResult.length === 0) {
    console.log(`Creating merge request from ${versionBranch} to ${currentBranch}.`);
    await api.MergeRequests.create(projectId, versionBranch, currentBranch, mrTitle, {
      description: mrBody,
      removeSourceBranch: false,
    });
  } else {
    console.log(`Updating found merge request: ${searchResult[0].iid}`);
    await api.MergeRequests.edit(projectId, searchResult[0].iid, {
      title: mrTitle,
      description: mrBody,
      removeSourceBranch: false,
    });
  }
};
