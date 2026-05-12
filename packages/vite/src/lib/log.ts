import type { BuildResult } from "@serwist/build";
import { cyan, dim, green, yellow } from "kolorist";
import type { SerwistViteContext } from "./context.js";

export const logSerwistResult = (buildResult: Pick<BuildResult, "count" | "size" | "warnings">, ctx: SerwistViteContext) => {
  const { count, size, warnings } = buildResult;
  const hasWarnings = warnings && warnings.length > 0;
  ctx.logger[hasWarnings ? "warn" : "info"](
    `${green("✓ files generated.")}\n${cyan(count)} precache entries ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}${
      hasWarnings ? `\n${yellow(["⚠ warnings", ...warnings.map((w) => `  ${w}`), ""].join("\n"))}` : ""
    }`,
  );
};
