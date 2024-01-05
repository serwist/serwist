import { yellow } from "kolorist";

import type { SerwistViteContext } from "./context.js";
import { logSerwistResult } from "./log.js";
import { generateInjectManifest } from "./modules.js";
import type { ExtendManifestEntriesHook, SerwistViteApi } from "./types.js";

export const createApi = (ctx: SerwistViteContext): SerwistViteApi => {
  return {
    get disabled() {
      return ctx?.options?.disable;
    },
    async generateSW() {
      if (ctx.options.disable) {
        return undefined;
      }
      const buildResult = await generateInjectManifest(ctx);
      if (buildResult) {
        if (ctx.viteConfig.isProduction) {
          // Log Serwist result
          logSerwistResult(buildResult, ctx.viteConfig);
        } else if (buildResult.warnings && buildResult.warnings.length > 0) {
          console.warn(yellow(["[@serwist/vite] Warnings", ...buildResult.warnings.map((w) => ` - ${w}`), ""].join("\n")));
        }
      }
    },
    extendManifestEntries(fn: ExtendManifestEntriesHook) {
      const { options } = ctx;
      if (options.disable) return;

      const result = fn(options.injectManifest.additionalPrecacheEntries || []);

      if (result != null) {
        options.injectManifest.additionalPrecacheEntries = result;
      }
    },
  };
};
