import fs from "node:fs/promises";
import path from "node:path";

import type * as SerwistBuild from "@serwist/build";

import type { SerwistViteContext } from "./context.js";

export const loadSerwistBuild = async (): Promise<typeof SerwistBuild> => {
  // "@serwist/build" is large and makes config loading slow.
  // Since it is not always used, we only load this when it is needed.
  try {
    return await import("@serwist/build");
  } catch (_) {
    // We don't have a default export, don't worry.
    return require("@serwist/build");
  }
};

export const generateInjectManifest = async (ctx: SerwistViteContext) => {
  const { build } = await import("vite");

  const define: Record<string, any> = {
    // Nuxt does some really weird stuff. During the build, they MANUALLY
    // set browser APIs, such as window, document, location,..., to `undefined`??
    // Probably some Vue or server stuff. Their `define` doesn't seem to have anything
    // particularly useful for the service worker anyway, so we don't extend it.
    ...(ctx.framework === "nuxt" ? undefined : ctx.viteConfig.define),
    "process.env.NODE_ENV": `"${ctx.options.mode}"`,
  };

  const { format, plugins, rollupOptions } = ctx.options.injectManifestRollupOptions;

  const parsedSwDest = path.parse(ctx.options.injectManifest.swDest);

  if (ctx.viteConfig.isProduction || ctx.options.devOptions.bundle) {
    await build({
      logLevel: ctx.viteConfig.isProduction ? "info" : "warn",
      root: ctx.viteConfig.root,
      base: ctx.viteConfig.base,
      resolve: ctx.viteConfig.resolve,
      // Don't copy anything from public folder
      publicDir: false,
      build: {
        sourcemap: ctx.viteConfig.build.sourcemap,
        lib: {
          entry: ctx.options.injectManifest.swSrc,
          name: "app",
          formats: [format],
        },
        rollupOptions: {
          ...rollupOptions,
          plugins,
          output: {
            entryFileNames: parsedSwDest.base,
          },
        },
        outDir: parsedSwDest.dir,
        emptyOutDir: false,
        minify: ctx.viteConfig.isProduction || ctx.options.devOptions.minify,
      },
      configFile: false,
      define,
    });
  } else {
    await fs.copyFile(ctx.options.injectManifest.swSrc, ctx.options.injectManifest.swDest);
  }

  // If the user doesn't have an injectionPoint, skip injectManifest.
  if (!ctx.options.injectManifest.injectionPoint) return;

  await ctx.options.integration?.beforeBuildServiceWorker?.(ctx.options);

  const resolvedInjectManifestOptions = {
    ...ctx.options.injectManifest,
    // This will not fail since there is an injectionPoint
    swSrc: ctx.options.injectManifest.swDest,
  };

  const { injectManifest } = await loadSerwistBuild();

  // Inject the manifest
  return await injectManifest(resolvedInjectManifestOptions);
};
