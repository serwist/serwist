import type { SerwistViteContext } from "./context.js";
import { generateServiceWorker } from "./modules.js";
import type { SerwistViteApi } from "./types.js";

/**
 * @deprecated
 * @param ctx 
 * @returns 
 */
export const createApi = (ctx: SerwistViteContext): SerwistViteApi => {
  return {
    get disabled() {
      return ctx?.options?.disable;
    },
    async generateSW() {
      if (ctx.options.disable) return undefined;
      await generateServiceWorker(ctx);
    },
  };
};
