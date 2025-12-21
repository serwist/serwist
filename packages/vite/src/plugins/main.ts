import path from "node:path";
import { createLogger } from "@serwist/utils/node";
import { BuildEnvironment, DevEnvironment, type EnvironmentOptions, type Plugin, type ResolvedConfig, type UserConfig } from "vite";
import type { SerwistViteContext } from "../lib/context.js";
import { loadVirtual, resolveVirtualId, serwistBuild } from "../lib/modules.js";
import { resolveOptions } from "../lib/options.js";

const getEnvironmentOptions = async (ctx: SerwistViteContext, viteConfig: ResolvedConfig): Promise<EnvironmentOptions> => {
  const parsedSwDest = path.parse(ctx.options.injectManifest.swDest);

  // await ctx.options.integration?.beforeBuildServiceWorker?.(ctx.options);

  // Custom InjectManifest for Vite. This mode also bundles the service worker in addition
  // to injecting the precache manifest into it.
  const { getFileManifestEntries } = await serwistBuild;

  const injectManifestResult = await getFileManifestEntries(ctx.options.injectManifest);

  const manifestString = injectManifestResult.manifestEntries === undefined ? "undefined" : JSON.stringify(injectManifestResult.manifestEntries);

  const define: Record<string, any> = {
    // Nuxt is weird: during the build, it manually defines browser APIs, such as `window`,
    // `document`, `location`,..., as `undefined`. `define` doesn't seem to have anything
    // particularly useful for the service worker as well, so we don't extend it.
    ...(ctx.framework === "nuxt" ? undefined : viteConfig.define),
    "process.env.NODE_ENV": `"${ctx.options.mode}"`,
  };

  if (ctx.options.injectManifest.injectionPoint) define[ctx.options.injectManifest.injectionPoint] = manifestString;

  return {
    define,
    build: {
      outDir: parsedSwDest.dir,
      emptyOutDir: false,
      minify: ctx.options.mode === "production" || ctx.options.devOptions.minify ? "esbuild" : false,
      rollupOptions: {
        ...viteConfig.build.rollupOptions,
        ...ctx.options.rollupOptions,
        input: {
          [parsedSwDest.name]: ctx.options.injectManifest.swSrc,
        },
        output: {
          ...viteConfig.build.rollupOptions.output,
          format: ctx.options.rollupFormat,
          entryFileNames: parsedSwDest.base,
        },
      },
    },
  };
};

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
        environments: {
          serwist: {
            consumer: "client",
            publicDir: false,
            configFile: false,
            dev: {
              async createEnvironment(name, config) {
                return new DevEnvironment(name, config, {
                  hot: false,
                  options: await getEnvironmentOptions(ctx, config),
                });
              },
            },
            build: {
              async createEnvironment(name, config) {
                return new BuildEnvironment(name, config, {
                  options: await getEnvironmentOptions(ctx, config),
                });
              },
            },
          },
        },
      };
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
