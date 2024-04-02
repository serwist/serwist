import fs from "node:fs";
import assembleReleasePlan from "@changesets/assemble-release-plan";
import { parse as parseConfig } from "@changesets/config";
import type { PackageJSON, WrittenConfig } from "@changesets/types";
import { glob } from "glob";
import { getPackages } from "./get-packages.js";
import { readChangesetState } from "./read-changeset-state.js";
import { getPackageJson } from "./utils.js";

export const getChangedPackages = async ({
  changedFiles,
}: {
  changedFiles: string[];
}) => {
  const rootPackageJson = JSON.parse(fs.readFileSync("package.json", "utf-8")) as PackageJSON;

  const [potentialWorkspaces, changesetState] = await Promise.all([
    glob("**/package.json", { absolute: false, ignore: ["node_modules/**"], nodir: true }),
    readChangesetState(),
  ]);

  const matches = getPackages(potentialWorkspaces);

  const packages = {
    tool: "pnpm",
    packages: matches.map((m) => ({
      packageJson: getPackageJson(m),
      dir: m,
    })),
    root: {
      packageJson: rootPackageJson,
      dir: "/",
    },
  } as const;

  const config = parseConfig(JSON.parse(fs.readFileSync(".changeset/config.json", "utf-8")) as WrittenConfig, packages);

  const releasePlan = assembleReleasePlan(changesetState.changesets, packages, config, changesetState.preState);

  return {
    changedPackages: packages.packages
      .filter((pkg) => changedFiles.some((changedFile) => changedFile.includes(pkg.dir)))
      .filter((pkg) => pkg.packageJson.private !== true && !config.ignore.includes(pkg.packageJson.name))
      .map((x) => x.packageJson.name),
    releasePlan,
  };
};
