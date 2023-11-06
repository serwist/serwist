import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import fg from "fast-glob";
import type { NextConfig } from "next";
import type NextConfigShared from "next/dist/server/config-shared.js";
import type { Configuration, default as Webpack } from "webpack";

import { loadTSConfig, logger } from "$utils/index.js";

import defaultCache from "./cache.js";
import { resolveWorkboxPlugin } from "./resolve-workbox-plugin.js";
import type { PluginOptions } from "./types.js";
import { getFileHash } from "./utils.js";
import { buildSWEntryWorker } from "./webpack-builders/build-sw-entry-worker.js";
import { setDefaultContext } from "./webpack-builders/context.js";

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const withPWAInit = (
  pluginOptions: PluginOptions = {}
): ((nextConfig?: NextConfig) => NextConfig) => {
  return (nextConfig = {}) => ({
    ...nextConfig,
    webpack(config: Configuration, options) {
      let nextDefConfig: NextConfig | undefined;

      try {
        nextDefConfig = (
          require("next/dist/server/config-shared") as typeof NextConfigShared
        ).defaultConfig;
      } catch {
        // do nothing - we are using Next's internals and they might not be available.
      }

      const isAppDirEnabled =
        (nextConfig.experimental as any)?.appDir ??
        (nextDefConfig?.experimental as any)?.appDir ??
        true;

      const webpack: typeof Webpack = options.webpack;
      const {
        buildId,
        dev,
        config: {
          distDir = ".next",
          pageExtensions = ["tsx", "ts", "jsx", "js", "mdx"],
        },
      } = options;

      const basePath = options.config.basePath || "/";

      const tsConfigJson = loadTSConfig(
        options.dir,
        nextConfig?.typescript?.tsconfigPath
      );

      // For Workbox configurations:
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW
      const {
        disable = false,
        register = true,
        dest = distDir,
        sw = "sw.js",
        cacheStartUrl = true,
        dynamicStartUrl = true,
        dynamicStartUrlRedirect,
        publicExcludes = ["!noprecache/**/*"],
        buildExcludes = [],
        fallbacks = {},
        cacheOnFrontEndNav = false,
        aggressiveFrontEndNavCaching = false,
        reloadOnOnline = true,
        scope = basePath,
        customWorkerDir,
        customWorkerSrc = customWorkerDir || "worker",
        customWorkerDest = dest,
        customWorkerPrefix = "worker",
        workboxOptions = {},
        extendDefaultRuntimeCaching = false,
        swcMinify = nextConfig.swcMinify ?? nextDefConfig?.swcMinify ?? false,
        browserslist = "chrome >= 56",
        watchWorkersInDev = false,
      } = pluginOptions;

      if (typeof nextConfig.webpack === "function") {
        config = nextConfig.webpack(config, options);
      }

      if (disable) {
        options.isServer && logger.info("PWA support is disabled.");
        return config;
      }

      const importScripts: string[] = [];

      if (!config.plugins) {
        config.plugins = [];
      }

      logger.event(
        `Compiling for ${options.isServer ? "server" : "client (static)"}...`
      );

      const _sw = path.posix.join(basePath, sw);
      const _scope = path.posix.join(scope, "/");

      config.plugins.push(
        new webpack.DefinePlugin({
          __PWA_SW__: `'${_sw}'`,
          __PWA_SCOPE__: `'${_scope}'`,
          __PWA_ENABLE_REGISTER__: `${Boolean(register)}`,
          __PWA_START_URL__: dynamicStartUrl ? `'${basePath}'` : undefined,
          __PWA_CACHE_ON_FRONT_END_NAV__: `${Boolean(cacheOnFrontEndNav)}`,
          __PWA_AGGRFEN_CACHE__: `${Boolean(aggressiveFrontEndNavCaching)}`,
          __PWA_RELOAD_ON_ONLINE__: `${Boolean(reloadOnOnline)}`,
        })
      );

      const swEntryJs = path.join(__dirname, "sw-entry.js");
      const entry = config.entry as () => Promise<
        Record<string, string[] | string>
      >;
      config.entry = () =>
        entry().then((entries) => {
          if (entries["main.js"] && !entries["main.js"].includes(swEntryJs)) {
            if (Array.isArray(entries["main.js"])) {
              entries["main.js"].unshift(swEntryJs);
            } else if (typeof entries["main.js"] === "string") {
              entries["main.js"] = [swEntryJs, entries["main.js"]];
            }
          }
          if (entries["main-app"] && !entries["main-app"].includes(swEntryJs)) {
            if (Array.isArray(entries["main-app"])) {
              entries["main-app"].unshift(swEntryJs);
            } else if (typeof entries["main-app"] === "string") {
              entries["main-app"] = [swEntryJs, entries["main-app"]];
            }
          }
          return entries;
        });

      if (!options.isServer) {
        setDefaultContext("shouldMinify", !dev);
        setDefaultContext("useSwcMinify", swcMinify);
        setDefaultContext("browserslist", browserslist);
        setDefaultContext("devWatchWorkers", watchWorkersInDev);

        const _dest = path.join(options.dir, dest);
        const sweWorkerPath = buildSWEntryWorker({
          isDev: dev,
          destDir: _dest,
          shouldGenSWEWorker: cacheOnFrontEndNav,
          basePath,
        });

        config.plugins.push(
          new webpack.DefinePlugin({
            __PWA_SW_ENTRY_WORKER__: sweWorkerPath && `'${sweWorkerPath}'`,
          })
        );

        if (!register) {
          logger.info(
            "Service worker won't be automatically registered as per the config, please call the following code in componentDidMount or useEffect:"
          );

          logger.info(`  window.workbox.register()`);

          if (
            !tsConfigJson?.compilerOptions?.types?.includes(
              "@ducanh2912/next-pwa/workbox"
            )
          ) {
            logger.info(
              "You may also want to add @ducanh2912/next-pwa/workbox to compilerOptions.types in your tsconfig.json/jsconfig.json."
            );
          }
        }

        logger.info(`Service worker: ${path.join(_dest, sw)}`);
        logger.info(`  URL: ${_sw}`);
        logger.info(`  Scope: ${_scope}`);

        config.plugins.push(
          new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
              path.join(_dest, "workbox-*.js"),
              path.join(_dest, "workbox-*.js.map"),
              path.join(_dest, sw),
              path.join(_dest, `${sw}.map`),
              path.join(_dest, "sw-chunks/**"),
            ],
          })
        );

        const {
          additionalManifestEntries,
          modifyURLPrefix = {},
          manifestTransforms = [],
          // @ts-expect-error removed from types
          exclude,
          ...workbox
        } = workboxOptions;

        // Precache files in public folder
        let manifestEntries = additionalManifestEntries ?? [];

        if (!manifestEntries) {
          manifestEntries = fg
            .sync(
              [
                "**/*",
                "!workbox-*.js",
                "!workbox-*.js.map",
                "!worker-*.js",
                "!worker-*.js.map",
                "!fallback-*.js",
                "!fallback-*.js.map",
                `!${sw.replace(/^\/+/, "")}`,
                `!${sw.replace(/^\/+/, "")}.map`,
                ...publicExcludes,
              ],
              {
                cwd: "public",
              }
            )
            .map((f) => ({
              url: path.posix.join(basePath, f),
              revision: getFileHash(`public/${f}`),
            }));
        }

        if (cacheStartUrl) {
          if (!dynamicStartUrl) {
            manifestEntries.push({
              url: basePath,
              revision: buildId,
            });
          } else if (
            typeof dynamicStartUrlRedirect === "string" &&
            dynamicStartUrlRedirect.length > 0
          ) {
            manifestEntries.push({
              url: dynamicStartUrlRedirect,
              revision: buildId,
            });
          }
        }

        Object.keys(workbox).forEach(
          (key) => workbox[key] === undefined && delete workbox[key]
        );

        const workboxPlugin = resolveWorkboxPlugin({
          workboxOptions: workbox,
          importScripts,

          extendDefaultRuntimeCaching,
          dynamicStartUrl,

          rootDir: options.dir,
          destDir: _dest,
          basePath,
          buildId,
          pageExtensions,
          isDev: dev,
          isAppDirEnabled,
          plugins: config.plugins.filter(
            (plugin) => plugin instanceof webpack.DefinePlugin
          ),
          tsConfigJson,

          customWorkerSrc,
          customWorkerDest,
          customWorkerPrefix,
          fallbacks,

          sw,
          buildExcludes,
          manifestEntries,
          manifestTransforms,
          modifyURLPrefix,
          publicPath: config.output?.publicPath,
        });

        config.plugins.push(workboxPlugin);
      }

      return config;
    },
  });
};

export default withPWAInit;
export { defaultCache as runtimeCaching };
export * from "./types.js";
