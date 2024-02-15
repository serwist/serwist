import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextInjectManifestOptions } from "@serwist/build";
import { validateNextInjectManifestOptions } from "@serwist/build/next";
import { InjectManifest } from "@serwist/webpack-plugin";
import { ChildCompilationPlugin, relativeToOutputPath } from "@serwist/webpack-plugin/internal";
import { globSync } from "glob";
import type { NextConfig } from "next";
import type { Compilation, Configuration, default as Webpack } from "webpack";

import type { ExcludeParams, SerwistNextOptions, SerwistNextOptionsKey } from "./internal-types.js";
import { getContentHash, getFileHash, loadTSConfig, logger } from "./utils/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const withSerwistInit = (pluginOptions: NextInjectManifestOptions): ((nextConfig?: NextConfig) => NextConfig) => {
  return (nextConfig = {}) => ({
    ...nextConfig,
    webpack(config: Configuration, options) {
      const webpack: typeof Webpack = options.webpack;
      const { dev } = options;

      const basePath = options.config.basePath || "/";

      const tsConfigJson = loadTSConfig(options.dir, nextConfig?.typescript?.tsconfigPath);

      const {
        cacheOnNavigation,
        disable,
        scope = basePath,
        swUrl,
        register,
        reloadOnOnline,
        globPublicPatterns,
        ...buildOptions
      } = validateNextInjectManifestOptions(pluginOptions);

      if (typeof nextConfig.webpack === "function") {
        config = nextConfig.webpack(config, options);
      }

      if (disable) {
        options.isServer && logger.info("Serwist is disabled.");
        return config;
      }

      if (!config.plugins) {
        config.plugins = [];
      }

      logger.event(`Compiling for ${options.isServer ? "server" : "client (static)"}...`);

      const _sw = path.posix.join(basePath, swUrl);
      const _scope = path.posix.join(scope, "/");

      config.plugins.push(
        new webpack.DefinePlugin({
          "self.__SERWIST_SW_ENTRY.sw": `'${_sw}'`,
          "self.__SERWIST_SW_ENTRY.scope": `'${_scope}'`,
          "self.__SERWIST_SW_ENTRY.cacheOnNavigation": `${cacheOnNavigation}`,
          "self.__SERWIST_SW_ENTRY.register": `${register}`,
          "self.__SERWIST_SW_ENTRY.reloadOnOnline": `${reloadOnOnline}`,
        } satisfies Record<`${SerwistNextOptionsKey}.${Exclude<keyof SerwistNextOptions, "swEntryWorker">}`, string | undefined>),
      );

      const swEntryJs = path.join(__dirname, "sw-entry.js");
      const entry = config.entry as () => Promise<Record<string, string[] | string>>;
      config.entry = async () => {
        const entries = await entry();
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
      };

      if (!options.isServer) {
        if (!register) {
          logger.info(
            "Service worker won't be automatically registered as per the config, please call the following code in componentDidMount or useEffect:",
          );

          logger.info("  window.serwist.register()");

          if (!tsConfigJson?.compilerOptions?.types?.includes("@serwist/next/typings")) {
            logger.info("You may also want to add @serwist/next/typings to compilerOptions.types in your tsconfig.json/jsconfig.json.");
          }
        }

        const {
          swSrc: userSwSrc,
          swDest: userSwDest,
          additionalPrecacheEntries,
          exclude,
          manifestTransforms = [],
          ...otherBuildOptions
        } = buildOptions;

        let swSrc = userSwSrc;
        let swDest = userSwDest;

        // If these two paths are not absolute, they will be resolved from `compilation.options.output.path`,
        // which is `${options.dir}/${nextConfig.destDir}` for Next.js apps, rather than `${options.dir}`
        // as an user would expect.
        if (!path.isAbsolute(swSrc)) {
          swSrc = path.join(options.dir, swSrc);
        }
        if (!path.isAbsolute(swDest)) {
          swDest = path.join(options.dir, swDest);
        }

        const publicDir = path.resolve(options.dir, "public");
        const { dir: destDir, base: destBase } = path.parse(swDest);

        const cleanUpList = globSync(["swe-worker-*.js", "swe-worker-*.js.map", destBase, `${destBase}.map`], {
          absolute: true,
          nodir: true,
          cwd: destDir,
        });

        for (const file of cleanUpList) {
          fs.rm(file, { force: true }, (err) => {
            if (err) throw err;
          });
        }

        const shouldBuildSWEntryWorker = cacheOnNavigation;
        let swEntryPublicPath: string | undefined = undefined;
        let swEntryWorkerDest: string | undefined = undefined;

        if (shouldBuildSWEntryWorker) {
          const swEntryWorkerSrc = path.join(__dirname, "sw-entry-worker.js");
          const swEntryName = `swe-worker-${getContentHash(swEntryWorkerSrc, dev)}.js`;
          swEntryPublicPath = path.posix.join(basePath, swEntryName);
          swEntryWorkerDest = path.join(destDir, swEntryName);
          config.plugins.push(
            new ChildCompilationPlugin({
              src: swEntryWorkerSrc,
              dest: swEntryWorkerDest,
            }),
          );
        }
        config.plugins.push(
          new webpack.DefinePlugin({
            "self.__SERWIST_SW_ENTRY.swEntryWorker": swEntryPublicPath && `'${swEntryPublicPath}'`,
          } satisfies Record<`${SerwistNextOptionsKey}.${Extract<keyof SerwistNextOptions, "swEntryWorker">}`, string | undefined>),
        );

        logger.info(`Service worker: ${swDest}`);
        logger.info(`  URL: ${_sw}`);
        logger.info(`  Scope: ${_scope}`);

        // Precache files in public folder
        let resolvedManifestEntries = additionalPrecacheEntries;

        if (!resolvedManifestEntries) {
          const userPublicGlob = typeof globPublicPatterns === "string" ? [globPublicPatterns] : globPublicPatterns ?? ["**/*"];
          const publicScan = globSync(
            [
              ...userPublicGlob,
              // Forcibly include these in case the user outputs these files to `public`.
              "!swe-worker-*.js",
              "!swe-worker-*.js.map",
              `!${destBase}`,
              `!${destBase}.map`,
            ],
            {
              nodir: true,
              cwd: publicDir,
            },
          );
          resolvedManifestEntries = publicScan.map((f) => ({
            url: path.posix.join(basePath, f),
            revision: getFileHash(path.join(publicDir, f)),
          }));
        }

        const publicPath = config.output?.publicPath;

        config.plugins.push(
          new InjectManifest({
            swSrc,
            swDest,
            disablePrecacheManifest: dev,
            additionalPrecacheEntries: dev ? [] : resolvedManifestEntries,
            exclude: [
              ...exclude,
              ({ asset, compilation }: ExcludeParams) => {
                // Same as how `@serwist/webpack-plugin` does it. It is always
                // `relativeToOutputPath(compilation, originalSwDest)`.
                const swDestRelativeOutput = relativeToOutputPath(compilation, swDest);
                const swAsset = compilation.getAsset(swDestRelativeOutput);
                return (
                  // We don't need the service worker to be cached.
                  asset.name === swAsset?.name ||
                  asset.name.startsWith("server/") ||
                  /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/.test(asset.name) ||
                  (dev && !asset.name.startsWith("static/runtime/"))
                );
              },
            ],
            manifestTransforms: [
              ...manifestTransforms,
              async (manifestEntries, compilation) => {
                // This path always uses forward slashes, so it is safe to use it in the following string replace.
                const publicDirRelativeOutput = relativeToOutputPath(compilation as Compilation, publicDir);
                // `publicPath` is always `${assetPrefix}/_next/` for Next.js apps.
                const publicFilesPrefix = `${publicPath}${publicDirRelativeOutput}`;
                const manifest = manifestEntries.map((m) => {
                  m.url = m.url.replace("/_next//static/image", "/_next/static/image").replace("/_next//static/media", "/_next/static/media");
                  // We remove `${publicPath}/${publicDirRelativeOutput}` because `assetPrefix`
                  // is not intended for files that are in the public directory and we also want
                  // to remove `/_next/${publicDirRelativeOutput}` from the URL, since that is not how
                  // we resolve files in the public directory.
                  if (m.url.startsWith(publicFilesPrefix)) {
                    m.url = path.posix.join(basePath, m.url.replace(publicFilesPrefix, ""));
                  }
                  m.url = m.url.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
                  return m;
                });
                return { manifest, warnings: [] };
              },
            ],
            ...otherBuildOptions,
          }),
        );
      }

      return config;
    },
  });
};

export default withSerwistInit;
export type { NextInjectManifestOptions as PluginOptions };
