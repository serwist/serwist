import { createLogger } from "@serwist/utils/node";
import type { Plugin, UserConfig } from "vite";
import { resolveOptions } from "vite-plugin-serwist";
import type { SerwistReactRouterContext } from "../lib/context.js";
import { resolveDefaultOptions } from "../lib/options.js";
import type { PluginOptions } from "../types.js";

/**
 * Internal plugin used by `@serwist/react-router`.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const mainPlugin = (ctx: SerwistReactRouterContext, userOptions: PluginOptions) => {
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
      const resolvedOptions = resolveDefaultOptions(ctx, userOptions, config);
      if (!resolvedOptions) {
        return;
      }
      ctx.userOptions = resolvedOptions;
      ctx.viteConfig = config;
      ctx.userOptions.integration?.configureOptions?.(config, ctx.userOptions);
      ctx.options = await resolveOptions(ctx.userOptions, config);
      ctx.logger = createLogger(config.logLevel, { prefix: "@serwist/react-router" });
    },
  };
};
