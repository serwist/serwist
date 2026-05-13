import { BuildEnvironment, DevEnvironment, type Plugin, type UserConfig } from "vite";
import type { PluginContext } from "../lib/context.js";
import { getEnvironmentOptions } from "../lib/environment.js";
import { resolveOptions } from "../lib/options.js";
import { loadVirtual, resolveVirtualId } from "../lib/virtual.js";

/**
 * `vite-plugin-serwist`'s main plugin.
 * @param ctx
 * @param api
 * @returns
 */
export const mainPlugin = (ctx: PluginContext) => {
  return <Plugin>{
    name: "vite-plugin-serwist",
    config() {
      return {
        environments: {
          serwist: {
            consumer: "client",
            dev: {
              async createEnvironment(name, config) {
                return new DevEnvironment(name, config, {
                  hot: false,
                  options: await getEnvironmentOptions(ctx.options, ctx.framework, config),
                });
              },
            },
            build: {
              async createEnvironment(name, config) {
                return new BuildEnvironment(name, config, {
                  options: await getEnvironmentOptions(ctx.options, ctx.framework, config),
                });
              },
            },
          },
        },
      } satisfies UserConfig;
    },
    async configResolved(config) {
      ctx.userOptions?.integration?.configureOptions?.(config, ctx.userOptions);
      ctx.options = await resolveOptions(ctx.userOptions, config);
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (ctx.options.disable || req.url !== ctx.options.swUrl) {
          return next();
        }
        const env = server.environments.serwist;
        if (!env) {
          res.statusCode = 500;
          res.end();
          return;
        }
        const result = await env.transformRequest(ctx.options.injectManifest.swSrc);
        if (!result) {
          res.statusCode = 404;
          res.end();
          return;
        }
        await env.waitForRequestsIdle?.();
        res.setHeader("Content-Type", "application/javascript");
        res.statusCode = 200;
        res.end(result.code);
      });
    },
    resolveId(id) {
      return resolveVirtualId(id);
    },
    load(id) {
      return loadVirtual(id, ctx);
    },
  };
};
