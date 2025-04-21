import type { Plugin } from "vite";
import { generateServiceWorker } from "vite-plugin-serwist";

import type { SerwistReactRouterContext } from "../lib/context.js";

/**
 * Internal build plugin used by `@serwist/react-router`.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const buildPlugin = (ctx: SerwistReactRouterContext) => {
  return <Plugin>{
    name: "@serwist/react-router:build",
    enforce: "post",
    apply: "build",
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        // Build during SSR build, as React Router prerenders routes in this build phase.
        if (ctx.viteConfig.build.ssr && !ctx.options.disable) {
          await generateServiceWorker(ctx);
        }
      },
    },
    buildEnd(error) {
      if (error) throw error;
    },
  };
};
