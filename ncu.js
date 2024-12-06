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
const excludePackages = ["glob", "rimraf", "typescript"];

/**
 * @type {Promise<any>[]}
 */
const updatePromise = [];

for (const packageFile of packageJsonList) {
  updatePromise.push(
    updateAndLog({
      packageFile,
      upgrade: true,
      filter(packageName) {
        return !excludePackages.includes(packageName);
      },
      target(dep) {
        if (/^react(-dom)?$/.test(dep)) {
          return "@latest";
        }
        if (dep === "tailwindcss" || dep === "@tailwindcss/vite") {
          return "@next";
        }
        return "latest";
      },
    }),
  );
}

for (const packageFile of examplesPackageJsonList) {
  updatePromise.push(
    updateAndLog({
      packageFile,
      upgrade: true,
      filter(packageName) {
        return !excludePackages.includes(packageName);
      },
    }),
  );
}

await Promise.all(updatePromise);
