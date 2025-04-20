import path from "node:path";
import { createLogger } from "@serwist/utils/node";
import type { Plugin, UserConfig } from "vite";
import { createContext as createViteContext, resolveOptions } from "vite-plugin-serwist";
import type { SerwistReactRouterContext } from "../lib/context.js";
import { resolveDefaultOptions } from "../lib/options.js";
import { RESOLVED_SERWIST_VIRTUAL, SERWIST_VIRTUAL } from "../lib/constants.js";

export const mainPlugin = (ctx: SerwistReactRouterContext) => {
  return <Plugin>{
    name: "@serwist/react-router:main",
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
      // @ts-ignore Accessing React Router internals
      ctx.isReactRouterDevServer = config.__reactRouterPluginContext !== undefined;
      // @ts-ignore Accessing React Router internals
      ctx.reactRouterPluginContext = config.__reactRouterPluginContext ?? undefined;
      const resolvedOptions = resolveDefaultOptions(ctx, config);
      if (!resolvedOptions) return;
      const viteContext = createViteContext(resolvedOptions, "react-router");
      viteContext.viteConfig = config;
      viteContext.userViteConfig = ctx.userViteConfig;
      viteContext.userOptions.integration?.configureOptions?.(config, viteContext.userOptions);
      viteContext.options = await resolveOptions(viteContext.userOptions, config);
      viteContext.logger = createLogger(config.logLevel, { prefix: "@serwist/react-router" });
      ctx.viteContext = viteContext;
    },
    resolveId(id) {
      if (id === SERWIST_VIRTUAL) {
        return RESOLVED_SERWIST_VIRTUAL;
      }
      return undefined;
    },
    load(id) {
      if (!ctx.viteContext) return undefined;
      if (id === RESOLVED_SERWIST_VIRTUAL) {
        return `export const swUrl = "${path.posix.join(ctx.viteContext.options.base, ctx.viteContext.options.swUrl)}";
export const swScope = "${ctx.viteContext.options.scope}";
export const swType = "${ctx.viteContext.options.type}";`;
      }
      return undefined;
    },
  };
};
