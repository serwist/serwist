import type { Plugin } from "vite";

import type { SerwistViteContext } from "../context.js";
import type { SerwistViteApi } from "../types.js";

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
    async buildEnd(error) {
      if (error) throw error;
    },
  };
};
