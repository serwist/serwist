import type { Plugin } from "vite";

import type { SerwistViteContext } from "../../context.js";
import type { SerwistViteApi } from "../../types.js";

export const buildPlugin = (ctx: SerwistViteContext, api: SerwistViteApi) => {
  return <Plugin>{
    name: "@serwist/vite/integration-svelte:build",
    apply: "build",
    enforce: "pre",
    closeBundle: {
      sequential: true,
      enforce: "pre",
      async handler() {
        if (api && !api.disabled && ctx.viteConfig.build.ssr) {
          await api.generateSW();
        }
      },
    },
  };
};
