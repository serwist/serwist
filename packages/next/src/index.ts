import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { InjectManifest } from "@serwist/webpack-plugin";
import { ChildCompilationPlugin, relativeToOutputPath } from "@serwist/webpack-plugin/internal";
import { globSync } from "glob";
import type { NextConfig } from "next";
import type { Compilation, Configuration, default as Webpack } from "webpack";
import type { ExcludeParams, SerwistNextOptions, SerwistNextOptionsKey } from "./internal-types.js";
import { getContentHash, getFileHash, loadTSConfig, logger } from "./lib/index.js";
import type { InjectManifestOptions, InjectManifestOptionsComplete } from "./lib/types.js";
import { validateInjectManifestOptions } from "./lib/validator.js";

const dirname = "__dirname" in globalThis ? __dirname : fileURLToPath(new URL(".", import.meta.url));

let warnedTurbopack = false;

/**
 * Integrates Serwist into your Next.js app.
 * @param userOptions
 * @returns
 */
const withSerwistInit = (userOptions: InjectManifestOptions): ((nextConfig?: NextConfig) => NextConfig) => {
  if (!warnedTurbopack && process.env.TURBOPACK && !userOptions.disable && !process.env.SERWIST_SUPPRESS_TURBOPACK_WARNING) {
    warnedTurbopack = true;
    console.warn(
      `[@serwist/next] WARNING: You are using '@serwist/next' with \`next dev --turbopack\`, but Serwist doesn't support Turbopack at the moment. It is recommended that you set \`disable\` to \`process.env.NODE_ENV !== \"production\"\`. Follow https://github.com/serwist/serwist/issues/54 for progress on Serwist + Turbopack. You can also suppress this warning by setting SERWIST_SUPPRESS_TURBOPACK_WARNING=1.`,
    );
  }
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
      } = validateInjectManifestOptions(userOptions);

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

      const swEntryJs = path.join(dirname, "sw-entry.js");
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
            "The service worker will not be automatically registered, please call 'window.serwist.register()' in 'componentDidMount' or 'useEffect'.",
          );

          if (!tsConfigJson?.compilerOptions?.types?.includes("@serwist/next/typings")) {
            logger.info(
              "You may also want to add '@serwist/next/typings' to your TypeScript/JavaScript configuration file at 'compilerOptions.types'.",
            );
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
          follow: true,
          cwd: destDir,
        });

        for (const file of cleanUpList) {
          fs.rm(file, { force: true }, (err) => {
            if (err) throw err;
          });
        }

        const shouldBuildSWEntryWorker = cacheOnNavigation;
        let swEntryPublicPath: string | undefined;
        let swEntryWorkerDest: string | undefined;

        if (shouldBuildSWEntryWorker) {
          const swEntryWorkerSrc = path.join(dirname, "sw-entry-worker.js");
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

        logger.event(`Bundling the service worker script with the URL '${_sw}' and the scope '${_scope}'...`);

        // Precache files in public folder
        let resolvedManifestEntries = additionalPrecacheEntries;

        if (!resolvedManifestEntries) {
          const publicScan = globSync(globPublicPatterns, {
            nodir: true,
            follow: true,
            cwd: publicDir,
            ignore: ["swe-worker-*.js", destBase, `${destBase}.map`],
          });
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
                  // This excludes all JSON files in the compilation directory by filtering
                  // out paths that have slashes or don't end with `.json`. Only said files
                  // match this criterion.
                  /^[^/]*\.json$/.test(asset.name) ||
                  (dev && !asset.name.startsWith("static/runtime/"))
                );
              },
            ],
            manifestTransforms: [
              // TODO(ducanhgh): move this spread to below our transform function?
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
                  m.url = m.url.replace(/\[/g, "%5B").replace(/\]/g, "%5D").replace(/@/g, "%40");
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
export { validateInjectManifestOptions };
export type { InjectManifestOptions as PluginOptions, InjectManifestOptionsComplete as PluginOptionsComplete };
