import type { BuildResult } from "@serwist/build";
import { cyan, dim, green, yellow } from "kolorist";
import type { ResolvedConfig } from "vite";

import packageJson from "../../package.json" with { type: "json" };

export const logSerwistResult = (buildResult: Pick<BuildResult, "count" | "size" | "warnings">, viteOptions: ResolvedConfig) => {
  const { logLevel = "info" } = viteOptions;

  if (logLevel === "silent") return;

  const { count, size, warnings } = buildResult;

  if (logLevel === "info") {
    console.info(
      [
        "",
        `${cyan(`@serwist/vite v${packageJson.version}`)} ${green("files generated.")}`,
        `${green("✓")} ${count} precache entries ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}`,
        // log build warning
        warnings && warnings.length > 0 ? yellow(["⚠ warnings", ...warnings.map((w) => `  ${w}`), ""].join("\n")) : "",
      ].join("\n"),
    );
  }
};
