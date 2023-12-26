import type { SerwistViteContext } from "./context.js";
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
      return await generateInjectManifest(ctx.options, ctx.viteConfig);
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
