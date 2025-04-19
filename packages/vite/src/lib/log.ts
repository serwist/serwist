import type { BuildResult } from "@serwist/build";
import { dim, green, yellow } from "kolorist";

import type { SerwistViteContext } from "./context.js";

export const logSerwistResult = (buildResult: Pick<BuildResult, "count" | "size" | "warnings">, ctx: SerwistViteContext) => {
  const { count, size, warnings } = buildResult;

  ctx.logger.info(
    [
      `${green("files generated.")}`,
      `${green("✓")} ${count} precache entries ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}`,
      // log build warning
      warnings && warnings.length > 0 ? yellow(["⚠ warnings", ...warnings.map((w) => `  ${w}`), ""].join("\n")) : "",
    ].join("\n"),
    { skipLine: true },
  );
};
