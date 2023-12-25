import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type * as SerwistBuild from "@serwist/build";
import type { ResolvedConfig } from "vite";

import { logSerwistResult } from "./log.js";
import type { ResolvedPluginOptions } from "./types.js";

const _dirname = path.dirname(fileURLToPath(import.meta.url));

const loadSerwistBuild = async (): Promise<typeof SerwistBuild> => {
  // "@serwist/build" is large and makes config loading slow.
  // Since it is not always used, we only load this when it is needed.
  try {
    const workbox = await import("@serwist/build");
    return workbox;
  } catch (_) {
    return require("workbox-build");
  }
};

export const generateRegisterSw = async (options: ResolvedPluginOptions, source = "register") => {
  const sw = options.buildBase + options.injectManifest.swUrl;
  const scope = options.scope;

  const content = await fs.readFile(path.resolve(_dirname, `client/${source}.js`), "utf-8");

  return content
    .replace(/__SW__/g, sw)
    .replace("__SCOPE__", scope)
    .replace("__SW_AUTO_UPDATE__", `${options.registerType === "autoUpdate"}`)
    .replace("__TYPE__", `${options.devOptions.enabled ? options.devOptions.type : "classic"}`);
};

export const generateInjectManifest = async (options: ResolvedPluginOptions, viteOptions: ResolvedConfig) => {
  // we will have something like this from swSrc:
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
    // don't copy anything from public folder
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

  await options.integration?.beforeBuildServiceWorker?.(options);

  const { swUrl, ...injectManifestOptions } = options.injectManifest;

  const resolvedInjectManifestOptions = {
    ...injectManifestOptions,
    // This will not fail since there is an injectionPoint
    swSrc: options.injectManifest.swDest,
  };

  const { injectManifest } = await loadSerwistBuild();

  // Inject the manifest
  const buildResult = await injectManifest(resolvedInjectManifestOptions);

  // Log workbox result
  logSerwistResult(buildResult, viteOptions);
};
