import type { Plugin } from "vite";

import type { SerwistViteContext } from "../lib/context.js";
import { generateServiceWorker } from "../lib/modules.js";

/**
 * Internal build plugin used by `vite-plugin-serwist`.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const buildPlugin = (ctx: SerwistViteContext) => {
  return <Plugin>{
    name: "vite-plugin-serwist:build",
    enforce: "post",
    apply: "build",
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        if (!ctx.viteConfig.build.ssr && !ctx.options.disable) {
          await generateServiceWorker(ctx);
        }
      },
    },
    buildEnd(error) {
      if (error) throw error;
    },
  };
};
