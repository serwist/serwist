import { execSync } from "node:child_process";
import fs from "node:fs";
import { Gitlab } from "@gitbeaker/rest";
import { setupUser } from "./lib/git-utils.js";
import { readChangesetState } from "./lib/read-changeset-state.js";
import { runPublish, runVersion } from "./lib/run.js";
import { getUsername } from "./lib/utils.js";

export const app = async () => {
  if (!process.env.GITLAB_TOKEN) {
    throw new Error("You must provide a GitLab token to publish!");
  }

  const api = new Gitlab({
    token: process.env.GITLAB_TOKEN,
  });

  if (process.env.CI) {
    console.log("Setting git user...");
    setupUser();

    console.log("Setting GitLab credentials...");
    const username = await getUsername(api);

    execSync(`git remote set-url origin https://${username}:${process.env.GITLAB_TOKEN}@gitlab.com/${process.env.CI_PROJECT_PATH!}.git`, {
      stdio: "inherit",
    });
  }

  const { filteredChangesets } = await readChangesetState();

  const hasChangesets = filteredChangesets.length > 0;

  if (!hasChangesets) {
    console.log("No changesets found, attempting to publish any unpublished packages to npm.");
    const npmrcPath = `${process.env.HOME!}/.npmrc`;

    if (fs.existsSync(npmrcPath)) {
      console.log("Found existing '.npmrc' file.");
    } else if (process.env.NPM_TOKEN) {
      console.log("No '.npmrc' file found, creating one...");
      fs.writeFileSync(npmrcPath, `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`);
    } else {
      throw new Error("No '.npmrc' found nor 'NPM_TOKEN' provided, unable to publish packages.");
    }

    await runPublish(api);
  } else if (hasChangesets) {
    await runVersion(api);
  }
};
