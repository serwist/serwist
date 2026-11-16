import type { Plugin } from "vite";

import type { SerwistViteContext } from "../lib/context.js";
import type { SerwistViteApi } from "../lib/types.js";
import { isEnvironmentsCapable, isPrimaryClientEnvironment } from "../lib/utils.js";

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
    applyToEnvironment(environment) {
      // The service worker describes the client build, so it is only generated
      // for the app's primary client environment.
      return isPrimaryClientEnvironment(environment);
    },
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        // Vite 5 silently ignores `applyToEnvironment`, so an SSR build still
        // reaches this hook. There we fall back to the legacy `build.ssr` check
        // to not generate a service worker in an SSR-only build. On Vite 6+ the
        // `applyToEnvironment` filter above already keeps this hook out of SSR
        // environments, so the check is skipped.
        if (!ctx.options.disable && (isEnvironmentsCapable(ctx.viteConfig) || !ctx.viteConfig.build.ssr)) {
          await api.generateSW();
        }
      },
    },
    buildEnd(error) {
      if (error) throw error;
    },
  };
};
