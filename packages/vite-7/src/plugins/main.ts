import path from "node:path";

import type { Plugin, UserConfig } from "vite";

import { RESOLVED_SERWIST_VIRTUAL, SERWIST_VIRTUAL } from "../lib/constants.js";
import type { SerwistViteContext } from "../lib/context.js";
import { resolveOptions } from "../lib/options.js";
import type { SerwistViteApi } from "../lib/types.js";

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
      if (id === SERWIST_VIRTUAL) {
        return RESOLVED_SERWIST_VIRTUAL;
      }
      return undefined;
    },
    load(id) {
      if (id === RESOLVED_SERWIST_VIRTUAL) {
        return `export const swUrl = "${path.posix.join(ctx.options.base, ctx.options.swUrl)}";
export const swScope = "${ctx.options.scope}";
export const swType = "${ctx.devEnvironment ? "module" : ctx.options.type}";
export const getSerwist = async () => {
  if ("serviceWorker" in navigator) {
    return new (await import("@serwist/window")).Serwist(swUrl, { scope: swScope, type: swType });
  }
  return undefined;
}`;
      }
      return undefined;
    },
    api,
  };
};
