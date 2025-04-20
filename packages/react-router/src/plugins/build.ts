import type { Plugin } from "vite";
import { generateServiceWorker } from "vite-plugin-serwist";

import type { SerwistReactRouterContext } from "../lib/context.js";

/**
 * Internal build plugin used by `vite-plugin-serwist`.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const buildPlugin = (ctx: SerwistReactRouterContext) => {
  return <Plugin>{
    name: "vite-plugin-serwist:build",
    enforce: "post",
    apply: "build",
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        // Build during SSR build, as React Router prerenders routes in this build phase.
        if (ctx.viteContext.viteConfig.build.ssr && !ctx.viteContext.options.disable) {
          await generateServiceWorker(ctx.viteContext);
        }
      },
    },
    buildEnd(error) {
      if (error) throw error;
    },
  };
};
