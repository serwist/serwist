import type { Plugin, UserConfig } from "vite";
import { resolveOptions } from "vite-plugin-serwist";
import type { SerwistAstroContext } from "../lib/context.js";

/**
 * Internal plugin used by `@serwist/astro`.
 * @internal
 * @param ctx
 * @returns
 */
export const mainPlugin = (ctx: SerwistAstroContext): Plugin => {
  return {
    name: "@serwist/astro",
    enforce: "pre",
    config(config) {
      ctx.userViteConfig = config;
      return <UserConfig>{
        ssr: {
          noExternal: [],
        },
      };
    },
    async configResolved(config) {
      ctx.viteConfig = config;
      ctx.userOptions?.integration?.configureOptions?.(config, ctx.userOptions);
      ctx.options = await resolveOptions(ctx.userOptions, config);
    },
  } satisfies Plugin;
};
