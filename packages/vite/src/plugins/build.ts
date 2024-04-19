import type { Plugin } from "vite";

import type { SerwistViteContext } from "../lib/context.js";
import type { SerwistViteApi } from "../lib/types.js";

/**
 * Internal build plugin used by `@serwist/vite`.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const buildPlugin = (ctx: SerwistViteContext, api: SerwistViteApi) => {
  return <Plugin>{
    name: "@serwist/vite:build",
    enforce: "post",
    apply: "build",
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        if (!ctx.viteConfig.build.ssr && !ctx.options.disable) {
          await api.generateSW();
        }
      },
    },
    buildEnd(error) {
      if (error) throw error;
    },
  };
};
