import path from "node:path";
import { fileURLToPath } from "node:url";

import { InjectManifest } from "@serwist/webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import fg from "fast-glob";
import type { NextConfig } from "next";
import type { Asset, Configuration, default as Webpack } from "webpack";

import type { SerwistNextOptions, SerwistNextOptionsKey } from "./internal-types.js";
import type { PluginOptions } from "./types.js";
import { getContentHash, getFileHash, loadTSConfig, logger } from "./utils/index.js";
import { ChildCompilationPlugin } from "./webpack/plugins/child-compilation-plugin.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const withPWAInit = (pluginOptions: PluginOptions): ((nextConfig?: NextConfig) => NextConfig) => {
  return (nextConfig = {}) => ({
    ...nextConfig,
    webpack(config: Configuration, options) {
      const webpack: typeof Webpack = options.webpack;
      const { buildId, dev } = options;

      const basePath = options.config.basePath || "/";

      const tsConfigJson = loadTSConfig(options.dir, nextConfig?.typescript?.tsconfigPath);

      const {
        disable = false,
        dest = "public",
        sw = "sw.js",
        cacheStartUrl = true,
        dynamicStartUrl = true,
        dynamicStartUrlRedirect,
        publicExcludes = ["!noprecache/**/*"],
        buildExcludes = [],
        cacheOnFrontEndNav = false,
        register = true,
        reloadOnOnline = true,
        scope = basePath,
        buildOptions,
      } = pluginOptions;

      if (typeof nextConfig.webpack === "function") {
        config = nextConfig.webpack(config, options);
      }

      if (disable) {
        options.isServer && logger.info("PWA support is disabled.");
        return config;
      }

      if (!config.plugins) {
        config.plugins = [];
      }

      logger.event(`Compiling for ${options.isServer ? "server" : "client (static)"}...`);

      const _sw = path.posix.join(basePath, sw);
      const _scope = path.posix.join(scope, "/");

      config.plugins.push(
        new webpack.DefinePlugin({
          "self.serwistNextOptions.sw": `'${_sw}'`,
          "self.serwistNextOptions.scope": `'${_scope}'`,
          "self.serwistNextOptions.startUrl": dynamicStartUrl ? `'${basePath}'` : undefined,
          "self.serwistNextOptions.cacheOnFrontEndNav": `${Boolean(cacheOnFrontEndNav)}`,
          "self.serwistNextOptions.register": `${Boolean(register)}`,
          "self.serwistNextOptions.reloadOnOnline": `${Boolean(reloadOnOnline)}`,
        } satisfies Record<`${SerwistNextOptionsKey}.${Exclude<keyof SerwistNextOptions, "swEntryWorker">}`, string | undefined>)
      );

      const swEntryJs = path.join(__dirname, "sw-entry.js");
      const entry = config.entry as () => Promise<Record<string, string[] | string>>;
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
        if (!register) {
          logger.info(
            "Service worker won't be automatically registered as per the config, please call the following code in componentDidMount or useEffect:"
          );

          logger.info(`  window.serwist.register()`);

          if (!tsConfigJson?.compilerOptions?.types?.includes("@serwist/next/typings")) {
            logger.info("You may also want to add @serwist/next/typings to compilerOptions.types in your tsconfig.json/jsconfig.json.");
          }
        }

        const resolvedDest = path.join(options.dir, dest);
        const shouldBuildSWEntryWorker = cacheOnFrontEndNav;
        let swEntryPublicPath: string | undefined = undefined;
        if (shouldBuildSWEntryWorker) {
          const swEntryWorkerSrc = path.join(__dirname, `sw-entry-worker.js`);
          const swEntryName = `swe-worker-${getContentHash(swEntryWorkerSrc, dev)}.js`;
          swEntryPublicPath = path.posix.join(basePath, swEntryName);
          const swEntryWorkerDest = path.join(resolvedDest, swEntryName);
          config.plugins.push(
            new ChildCompilationPlugin({
              src: swEntryWorkerSrc,
              dest: swEntryWorkerDest,
            })
          );
        }
        config.plugins.push(
          new webpack.DefinePlugin({
            "self.serwistNextOptions.swEntryWorker": swEntryPublicPath && `'${swEntryPublicPath}'`,
          } satisfies Record<`${SerwistNextOptionsKey}.${Extract<keyof SerwistNextOptions, "swEntryWorker">}`, string | undefined>)
        );

        logger.info(`Service worker: ${path.join(resolvedDest, sw)}`);
        logger.info(`  URL: ${_sw}`);
        logger.info(`  Scope: ${_scope}`);

        config.plugins.push(
          new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
              path.join(resolvedDest, "swe-worker-*.js"),
              path.join(resolvedDest, "swe-worker-*.js.map"),
              path.join(resolvedDest, sw),
              path.join(resolvedDest, `${sw}.map`),
            ],
          })
        );

        const { additionalManifestEntries, modifyURLPrefix = {}, manifestTransforms = [], ...otherBuildOptions } = buildOptions;

        // Precache files in public folder
        let resolvedManifestEntries = additionalManifestEntries ?? [];

        if (!resolvedManifestEntries) {
          resolvedManifestEntries = fg
            .sync(
              [
                "**/*",
                "!swe-worker-*.js",
                "!swe-worker-*.js.map",
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
            resolvedManifestEntries.push({
              url: basePath,
              revision: buildId,
            });
          } else if (typeof dynamicStartUrlRedirect === "string" && dynamicStartUrlRedirect.length > 0) {
            resolvedManifestEntries.push({
              url: dynamicStartUrlRedirect,
              revision: buildId,
            });
          }
        }

        const publicPath = config.output?.publicPath;

        config.plugins.push(
          new InjectManifest({
            additionalManifestEntries: dev ? [] : resolvedManifestEntries,
            exclude: [
              ...buildExcludes,
              ({ asset }: { asset: Asset }) => {
                if (asset.name.startsWith("server/") || asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)) {
                  return true;
                }
                if (dev && !asset.name.startsWith("static/runtime/")) {
                  return true;
                }
                return false;
              },
            ],
            modifyURLPrefix: {
              ...modifyURLPrefix,
              "/_next/../public/": "/",
            },
            manifestTransforms: [
              ...manifestTransforms,
              async (manifestEntries, compilation) => {
                const manifest = manifestEntries.map((m) => {
                  m.url = m.url.replace("/_next//static/image", "/_next/static/image");
                  m.url = m.url.replace("/_next//static/media", "/_next/static/media");
                  if (m.revision === null) {
                    let key = m.url;
                    if (typeof publicPath === "string" && key.startsWith(publicPath)) {
                      key = m.url.substring(publicPath.length);
                    }
                    const asset = (compilation as any).assetsInfo.get(key);
                    m.revision = asset ? asset.contenthash || buildId : buildId;
                  }
                  m.url = m.url.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
                  return m;
                });
                return { manifest, warnings: [] };
              },
            ],
            ...otherBuildOptions,
          })
        );
      }

      return config;
    },
  });
};

export default withPWAInit;
export * from "./types.js";
