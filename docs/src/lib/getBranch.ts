import { exec } from "node:child_process";

/**
 * Retrieves the current git branch.
 * @returns 
 */
export const getBranch = (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    exec("git rev-parse --abbrev-ref HEAD", (err, stdout, stderr) => {
      if (err) {
        reject("Failed to determine git branch.");
      }

      resolve(stdout.trim());
    });
  });
};
