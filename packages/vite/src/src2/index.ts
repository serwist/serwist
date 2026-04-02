import path from "node:path";
import type { InjectManifestOptions, InjectManifestOptionsComplete } from "@serwist/build";
import { asyncFn, injectManifestOptions as baseInjectManifestOptions, fn, SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import { type Require, resolveBasePath, slash } from "@serwist/utils";
import type { RollupOptions } from "rollup";
import { BuildEnvironment, DevEnvironment, type EnvironmentOptions, type Plugin, type ResolvedConfig, type UserConfig } from "vite";
import { z } from "zod";

const serwistBuild = import("@serwist/build");

interface Hooks {
  /**
   * Allows you to run some logic before the service worker is built.
   * @param options
   * @returns
   */
  beforeBuildServiceWorker?: (options: PluginOptionsComplete) => void | Promise<void>;
  /**
   * Adjusts the application order of `vite-plugin-serwist`'s `closeBundle` hook.
   */
  closeBundleOrder?: "pre" | "post" | null;
  /**
   * Allows you to configure the options of Serwist and Vite. Useful when there is a dependency between the two.
   * @param viteOptions
   * @param options
   * @returns
   */
  configureOptions?: (viteOptions: ResolvedConfig, options: PluginOptions) => void | Promise<void>;
}

interface VitePartial {
  /**
   * Whether Serwist should be disabled.
   *
   * @default false
   */
  disable?: boolean;
  /**
   * The module type with which the service worker should be registered. Usually used alongside
   * `rollupFormat`.
   *
   * @default "classic"
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#type
   */
  type?: WorkerType;
  /**
   * The service worker's URL scope. Set to `"/foo/"` so that paths under "/foo/"
   * are under the service worker's control while others are not.
   *
   * @default viteOptions.base
   * @see https://vitejs.dev/config/shared-options.html#base
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#scope
   */
  scope?: string;
  /**
   * The URL to the service worker.
   *
   * @default "/sw.js"
   */
  swUrl?: string;
  /**
   * Hooks of the build lifecycle.
   */
  integration?: Hooks;
  /**
   * Custom Rollup options used to build the service worker.
   */
  rollupOptions?: Omit<RollupOptions, "input" | "output">;
  framework?: "nuxt";
}

interface ViteResolved extends Require<VitePartial, "disable" | "type" | "scope" | "swUrl"> {}

interface PluginOptions extends VitePartial, Omit<InjectManifestOptions, "disablePrecacheManifest"> {}

interface PluginOptionsValidated extends ViteResolved {
  injectManifest: Omit<InjectManifestOptionsComplete, "disablePrecacheManifest">;
}

interface PluginOptionsComplete extends PluginOptionsValidated {
  injectManifest: InjectManifestOptionsComplete;
}

const getEnvironmentOptions = async (options: PluginOptionsComplete, viteConfig: ResolvedConfig): Promise<EnvironmentOptions> => {
  const parsedSwDest = path.parse(options.injectManifest.swDest);

  // await ctx.options.integration?.beforeBuildServiceWorker?.(ctx.options);

  const define: Record<string, any> = {
    // Nuxt is weird: during the build, it manually defines browser APIs, such as `window`,
    // `document`, `location`,..., as `undefined`. `define` doesn't seem to have anything
    // particularly useful for the service worker as well, so we don't extend it.
    ...(options.framework === "nuxt" ? undefined : viteConfig.define),
    // "process.env.NODE_ENV": `"${ctx.options.mode}"`,
  };

  if (viteConfig.isProduction && options.injectManifest.injectionPoint) {
    // Custom InjectManifest for Vite. This mode also bundles the service worker in addition
    // to injecting the precache manifest into it.
    const { getFileManifestEntries } = await serwistBuild;

    const injectManifestResult = await getFileManifestEntries(options.injectManifest);

    const manifestString = injectManifestResult.manifestEntries === undefined ? "undefined" : JSON.stringify(injectManifestResult.manifestEntries);

    define[options.injectManifest.injectionPoint] = manifestString;
  }

  return {
    define,
    build: {
      outDir: parsedSwDest.dir,
      emptyOutDir: false,
      minify: viteConfig.isProduction ? "esbuild" : false,
      rollupOptions: {
        ...viteConfig.build.rollupOptions,
        ...options.rollupOptions,
        input: {
          [parsedSwDest.name]: options.injectManifest.swSrc,
        },
        output: {
          ...viteConfig.build.rollupOptions.output,
          entryFileNames: parsedSwDest.base,
        },
      },
    },
  };
};

export const hooks = z.strictObject({
  beforeBuildServiceWorker: z
    .union([
      fn({
        input: [z.any()],
        output: z.void(),
      }),
      asyncFn({
        input: [z.any()],
        output: z.void(),
      }),
    ])
    .optional(),
  closeBundleOrder: z.union([z.literal("pre"), z.literal("post"), z.null()]).optional(),
  configureOptions: z
    .union([
      fn({
        input: [z.any(), z.any()],
        output: z.void(),
      }),
      asyncFn({
        input: [z.any(), z.any()],
        output: z.void(),
      }),
    ])
    .optional(),
});

export const vitePartial = z.strictObject({
  disable: z.boolean().prefault(false),
  type: z.literal(["classic", "module"]).prefault("classic"),
  scope: z.string(),
  swUrl: z.string().prefault("/sw.js"),
  integration: hooks.prefault({}),
  rollupOptions: z.record(z.string(), z.any()).prefault({}),
});

export const injectManifestOptions = z
  .strictObject({
    ...baseInjectManifestOptions.shape,
    ...vitePartial.shape,
  })
  .omit({ disablePrecacheManifest: true })
  .transform(
    ({ disable, type, scope, swUrl, integration, rollupOptions, ...injectManifest }): PluginOptionsValidated => ({
      disable,
      type,
      scope,
      swUrl,
      integration,
      rollupOptions,
      injectManifest,
    }),
  );

const resolveOptions = async (userOptions: PluginOptions, viteConfig: ResolvedConfig): Promise<PluginOptionsComplete> => {
  if (!userOptions.scope) userOptions.scope = resolveBasePath(viteConfig.base);
  const result = await injectManifestOptions.spa(userOptions, { error: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "vite-plugin-serwist", message: z.prettifyError(result.error) });
  }
  const injectManifest = result.data.injectManifest;

  let assetsDir = slash(viteConfig.build.assetsDir ?? "assets");
  if (assetsDir[assetsDir.length - 1] !== "/") assetsDir += "/";
  // remove './' prefix from assetsDir
  const dontCacheBustURLsMatching = new RegExp(`^${assetsDir.replace(/^\.*?\//, "")}`);

  return {
    ...result.data,
    injectManifest: {
      dontCacheBustURLsMatching,
      ...injectManifest,
      swSrc: path.resolve(viteConfig.root, injectManifest.swSrc),
      swDest: path.resolve(viteConfig.root, viteConfig.build.outDir, injectManifest.swDest),
      disablePrecacheManifest: !viteConfig.isProduction,
    },
  };
};

/**
 * Integrates Serwist into your Vite app.
 * @param userOptions
 * @returns
 */
export const serwist = (userOptions: PluginOptions): Plugin => {
  let options: PluginOptionsComplete;
  return <Plugin>{
    name: "vite-plugin-serwist",
    config() {
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
                  options: await getEnvironmentOptions(options, config),
                });
              },
            },
            build: {
              async createEnvironment(name, config) {
                return new BuildEnvironment(name, config, {
                  options: await getEnvironmentOptions(options, config),
                });
              },
            },
          },
        },
      };
    },
    async configResolved(config) {
      userOptions?.integration?.configureOptions?.(config, userOptions);
      options = await resolveOptions(userOptions, config);
      // ctx.logger = createLogger(config.logLevel, { prefix: "vite-plugin-serwist" });
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (options.disable || req.url !== options.swUrl) {
          return next();
        }
        const env = server.environments.serwist;
        if (!env) {
          res.statusCode = 500;
          res.end();
          return;
        }
        const result = await env.transformRequest(options.injectManifest.swSrc);
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
  };
};
