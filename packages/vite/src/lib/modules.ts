import path from "node:path";

import type { BuildResult, GetManifestResult } from "@serwist/build";

import type { SerwistViteContext } from "./context.js";
import { logSerwistResult } from "./log.js";

let invoked = false;

export const vite = import("vite");

export const serwistBuild = import("@serwist/build");

export const generateServiceWorker = async (ctx: SerwistViteContext): Promise<GetManifestResult | BuildResult | undefined> => {
  if (invoked) return;

  invoked = true;

  const parsedSwDest = path.parse(ctx.options.injectManifest.swDest);

  await ctx.options.integration?.beforeBuildServiceWorker?.(ctx.options);

  let injectManifestResult: GetManifestResult | BuildResult | undefined = undefined;

  if (ctx.options.mode === "development" && !ctx.options.devOptions.bundle) {
    // Classic InjectManifest. This mode is only run in development when `devOptions.bundle` is `false`.
    injectManifestResult = await (await serwistBuild).injectManifest(ctx.options.injectManifest);
  } else {
    // Custom InjectManifest for Vite. This mode also bundles the service worker in addition
    // to injecting the precache manifest into it.
    const { getFileManifestEntries, stringify } = await serwistBuild;

    injectManifestResult = await getFileManifestEntries(ctx.options.injectManifest);

    const manifestString = injectManifestResult.manifestEntries === undefined ? "undefined" : stringify(injectManifestResult.manifestEntries);

    const define: Record<string, any> = {
      // Nuxt is weird: during the build, it manually defines browser APIs, such as `window`,
      // `document`, `location`,..., as `undefined`. `define` doesn't seem to have anything
      // particularly useful for the service worker as well, so we don't extend it.
      ...(ctx.framework === "nuxt" ? undefined : ctx.viteConfig.define),
      "process.env.NODE_ENV": `"${ctx.options.mode}"`,
    };

    if (ctx.options.injectManifest.injectionPoint) define[ctx.options.injectManifest.injectionPoint] = manifestString;

    await (await vite).build({
      ...ctx.userViteConfig,
      // We shouldn't copy anything from public directory.
      publicDir: false,
      define,
      plugins: ctx.options.plugins,
      build: {
        rollupOptions: {
          ...ctx.options.rollupOptions,
          input: {
            [parsedSwDest.name]: ctx.options.injectManifest.swSrc,
          },
          output: {
            entryFileNames: parsedSwDest.base,
            format: ctx.options.rollupFormat,
          },
        },
        outDir: parsedSwDest.dir,
        emptyOutDir: false,
        minify: ctx.options.mode === "production" || ctx.options.devOptions.minify,
      },
      logLevel: ctx.viteConfig.isProduction ? "info" : "warn",
      configFile: false,
    });
  }

  if (injectManifestResult) {
    if (ctx.viteConfig.isProduction) {
      // Log Serwist result
      logSerwistResult(injectManifestResult, ctx);
    } else if (injectManifestResult.warnings && injectManifestResult.warnings.length > 0) {
      ctx.logger.warn((["Warnings", ...injectManifestResult.warnings.map((w) => ` - ${w}`), ""].join("\n")));
    }
  }

  invoked = false;

  return injectManifestResult;
};
