import fg from "fast-glob";
import { run } from "npm-check-updates";

/**
 * Update and then log updated dependencies.
 *
 * @param {import("npm-check-updates").RunOptions} runOptions
 */
const updateAndLog = async (runOptions) => {
  const upgraded = await run(runOptions);
  console.log(`Upgraded dependencies for ${runOptions.packageFile ?? "./package.json"}:`, upgraded);
};

const packageJsonList = await fg("**/package.json", {
  ignore: ["examples/**", "**/node_modules/**"],
});
const examplesPackageJsonList = await fg("examples/*/package.json", {
  ignore: ["**/node_modules/**"],
});

/**
 * @type {Promise<any>[]}
 */
const updatePromise = [];

for (const packageFile of packageJsonList) {
  updatePromise.push(
    updateAndLog({
      packageFile,
      upgrade: true,
      target: (dependencyName) => {
        if (dependencyName === "typescript") {
          return "@next";
        }
        if (/^react(-dom)?$/.test(dependencyName)) {
          return "@latest";
        }
        return "latest";
      },
    })
  );
}

for (const packageFile of examplesPackageJsonList) {
  updatePromise.push(
    updateAndLog({
      packageFile,
      upgrade: true,
    })
  );
}

await Promise.all(updatePromise);
