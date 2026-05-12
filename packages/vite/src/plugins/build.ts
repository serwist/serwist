import type { Plugin } from "vite";

import { build } from "../lib/build.js";
import type { SerwistViteContext } from "../lib/context.js";

/**
 * `vite-plugin-serwist`'s build plugin.
 * @param ctx
 * @param api
 * @returns
 */
export const buildPlugin = (ctx: SerwistViteContext): Plugin => {
  return {
    name: "vite-plugin-serwist:build",
    enforce: "post",
    apply: "build",
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        if (!ctx.viteConfig.build.ssr && !ctx.options.disable) {
          await build(ctx);
        }
      },
    },
    buildEnd(error) {
      if (error) throw error;
    },
  } satisfies Plugin;
};
