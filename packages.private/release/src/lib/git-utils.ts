import { execSync, spawnSync } from "node:child_process";

export const setupUser = () => {
  execSync(`git config user.name ${process.env.GITLAB_USER_NAME}`);
  execSync("git config user.email gitlab[bot]@users.noreply.gitlab.com");
};

export const pullBranch = (branch: string) => {
  execSync(`git pull origin ${branch}`);
};

export const push = (branch: string, { force }: { force?: boolean } = {}) => {
  execSync(`git push origin HEAD:${branch} ${force ? "--force" : ""}`);
};

export const pushTags = () => {
  execSync("git push origin --tags");
};

export const switchBranch = (branch: string) => {
  const { stderr } = spawnSync("git", ["checkout", branch], {
    encoding: "utf-8",
  });
  const isCreatingBranch =
    !stderr.includes(`Switched to branch '${branch}'`) &&
    // it could be a detached HEAD
    !stderr.includes(`Switched to a new branch '${branch}'`);
  if (isCreatingBranch) {
    execSync(`git checkout -b ${branch}`);
  }
};

export const reset = (pathSpec: string, mode: "hard" | "mixed" | "soft" = "hard") => {
  execSync(`git reset --${mode} ${pathSpec}`);
};

export const commitAll = (message: string) => {
  execSync("git add -A");
  execSync(`git commit -m ${message}`);
};

export const checkClean = (): boolean => {
  const { stdout } = spawnSync("git", ["status", "--porcelain"], {
    encoding: "utf-8",
  });
  return stdout.length === 0;
};
