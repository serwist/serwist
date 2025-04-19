import path from "node:path";
import type { Preset } from "@react-router/dev/config";
import type { InjectManifestOptions } from "./types.js";
import { validateInjectManifestOptions } from "./lib/validator.js";
import { resolveDefaultOptions } from "./lib/options.js";

const vite = import("vite");
const serwistBuild = import("@serwist/build");

export const serwist = (userOptions: InjectManifestOptions = {}): Preset => {
  return {
    name: "@serwist/react-router/preset",
    reactRouterConfig() {
      return {
        async buildEnd({ reactRouterConfig, viteConfig }) {
          const options = await validateInjectManifestOptions(resolveDefaultOptions(viteConfig, reactRouterConfig, userOptions));

          const resolvedSwSrc = path.resolve(viteConfig.root, options.swSrc);

          const parsedSwDest = path.parse(path.resolve(viteConfig.root, options.swDest));

          // Custom InjectManifest for Vite. This mode also bundles the service worker in addition
          // to injecting the precache manifest into it.
          const { getFileManifestEntries, stringify } = await serwistBuild;

          const injectManifestResult = await getFileManifestEntries(options);

          const manifestString = injectManifestResult.manifestEntries === undefined ? "undefined" : stringify(injectManifestResult.manifestEntries);

          const define: Record<string, any> = {
            ...viteConfig.define,
            [options.injectionPoint]: manifestString,
          };

          await (await vite).build({
            root: viteConfig.root,
            base: viteConfig.base,
            publicDir: false,
            cacheDir: viteConfig.cacheDir,
            mode: viteConfig.mode,
            esbuild: viteConfig.esbuild,
            resolve: viteConfig.resolve,
            define,
            dev: viteConfig.dev,
            build: {
              ...viteConfig.build,
              polyfillModulePreload: undefined,
              modulePreload: {
                polyfill: viteConfig.build.polyfillModulePreload,
              },
              outDir: parsedSwDest.dir,
              rollupOptions: {
                input: {
                  [parsedSwDest.name]: resolvedSwSrc,
                },
                output: {
                  entryFileNames: parsedSwDest.base,
                  // format: ctx.options.rollupFormat,
                },
              },
              emptyOutDir: false,
              manifest: false,
            },
            experimental: viteConfig.experimental,
            future: viteConfig.future,
            legacy: viteConfig.legacy,
            logLevel: viteConfig.logLevel,
            customLogger: viteConfig.customLogger,
            clearScreen: viteConfig.clearScreen,
            envDir: viteConfig.envDir,
            worker: viteConfig.worker,
            optimizeDeps: viteConfig.optimizeDeps,
            appType: viteConfig.appType,
            configFile: false,
          });
        },
      };
    },
  };
};
