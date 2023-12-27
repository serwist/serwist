import type { Plugin } from "vite";

import type { SerwistViteContext } from "../../context.js";
import { loadSerwistBuild } from "../../modules.js";
import type { SerwistViteApi } from "../../types.js";

export const serwistSveltePlugin = (ctx: SerwistViteContext, api: SerwistViteApi) => {
  return <Plugin>{
    name: "@serwist/vite/integration-svelte:build",
    apply: "build",
    enforce: "pre",
    closeBundle: {
      sequential: true,
      enforce: "pre",
      async handler() {
        if (api && !api.disabled && ctx.viteConfig.build.ssr) {
          const [injectManifest, logSerwistResult] = await Promise.all([
            loadSerwistBuild().then((m) => m.injectManifest),
            import("./log.js").then((m) => m.logSerwistResult),
          ]);
          // Inject the manifest
          const buildResult = await injectManifest(ctx.options.injectManifest);
          // Log Serwist result
          logSerwistResult(buildResult, ctx.viteConfig);
        }
      },
    },
  };
};
