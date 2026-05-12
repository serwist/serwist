import { createLogger } from "@serwist/utils/node";
import type { Plugin, UserConfig } from "vite";
import type { SerwistViteContext } from "../lib/context.js";
import { loadVirtual, resolveVirtualId } from "../lib/modules.js";
import { resolveOptions } from "../lib/options.js";

/**
 * `vite-plugin-serwist`'s main plugin.
 * @param ctx
 * @param api
 * @returns
 */
export const mainPlugin = (ctx: SerwistViteContext) => {
  return <Plugin>{
    name: "vite-plugin-serwist",
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
      ctx.logger = createLogger(config.logLevel, { prefix: "vite-plugin-serwist" });
    },
    resolveId(id) {
      return resolveVirtualId(id);
    },
    load(id) {
      return loadVirtual(id, ctx);
    },
  };
};
