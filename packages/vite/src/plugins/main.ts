import path from "node:path";

import type { Plugin, UserConfig } from "vite";

import { INTERNAL_SERWIST_VIRTUAL, RESOLVED_INTERNAL_SERWIST_VIRTUAL } from "../constants.js";
import type { SerwistViteContext } from "../context.js";
import { resolveOptions } from "../options.js";
import type { SerwistViteApi } from "../types.js";

/**
 * Internal plugin used by `@serwist/vite`.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const mainPlugin = (ctx: SerwistViteContext, api: SerwistViteApi) => {
  return <Plugin>{
    name: "@serwist/vite",
    enforce: "pre",
    config() {
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
    resolveId(id) {
      if (id === INTERNAL_SERWIST_VIRTUAL) {
        return RESOLVED_INTERNAL_SERWIST_VIRTUAL;
      }
      return undefined;
    },
    load(id) {
      if (id === RESOLVED_INTERNAL_SERWIST_VIRTUAL) {
        return `export const swUrl = "${path.posix.join(ctx.options.buildBase, ctx.options.swUrl)}";
export const swScope = "${ctx.options.scope}";
export const swType = "${ctx.devEnvironment ? "module" : ctx.options.type}";`;
      }
      return undefined;
    },
    api,
  };
};
