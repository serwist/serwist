import path from "node:path";

import type * as SerwistBuild from "@serwist/build";
import type { ResolvedConfig } from "vite";

import { logSerwistResult } from "./log.js";
import type { ResolvedPluginOptions } from "./types.js";

export const loadSerwistBuild = async (): Promise<typeof SerwistBuild> => {
  // "@serwist/build" is large and makes config loading slow.
  // Since it is not always used, we only load this when it is needed.
  try {
    return await import("@serwist/build");
  } catch (_) {
    return require("@serwist/build");
  }
};

export const generateInjectManifest = async (options: ResolvedPluginOptions, viteOptions: ResolvedConfig) => {
  // We will have something like this from swSrc:
  /*
  // sw.js
  import { precacheAndRoute } from 'workbox-precaching'
  // self.__WB_MANIFEST is default injection point
  precacheAndRoute(self.__WB_MANIFEST)
  */

  const { build } = await import("vite");

  const define: Record<string, any> = { ...(viteOptions.define ?? {}) };
  define["process.env.NODE_ENV"] = JSON.stringify(options.mode);

  const { format, plugins, rollupOptions } = options.injectManifestRollupOptions;

  const parsedSwDest = path.parse(options.injectManifest.swDest);

  await build({
    root: viteOptions.root,
    base: viteOptions.base,
    resolve: viteOptions.resolve,
    // Don't copy anything from public folder
    publicDir: false,
    build: {
      sourcemap: viteOptions.build.sourcemap,
      lib: {
        entry: options.injectManifest.swSrc,
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
    },
    configFile: false,
    define,
  });

  // If the user doesn't have an injectionPoint, skip injectManifest.
  if (!options.injectManifest.injectionPoint) return;

  await options.integration?.beforeBuildServiceWorker?.(options);

  const resolvedInjectManifestOptions = {
    ...options.injectManifest,
    // This will not fail since there is an injectionPoint
    swSrc: options.injectManifest.swDest,
  };

  const { injectManifest } = await loadSerwistBuild();

  // Inject the manifest
  const buildResult = await injectManifest(resolvedInjectManifestOptions);

  // Log workbox result
  logSerwistResult(buildResult, viteOptions);
};
