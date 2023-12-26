import path from "node:path";
import process from "node:process";

import type { ResolvedConfig } from "vite";

import { configureStaticAssets } from "./assets.js";
import type { PluginOptions, ResolvedPluginOptions } from "./types.js";
import { resolveBasePath, slash } from "./utils.js";

export const resolveOptions = async (options: PluginOptions, viteConfig: ResolvedConfig): Promise<ResolvedPluginOptions> => {
  const {
    mode = (process.env.NODE_ENV || "production") as "production" | "development",
    injectRegister = "auto",
    registerType = "prompt",
    minify = true,
    base = viteConfig.base,
    includeAssets = undefined,
    useCredentials = false,
    disable = false,
    devOptions = { enabled: false, type: "classic" },
    integration = {},
    buildBase,
    ...injectManifest
  } = options;

  const basePath = resolveBasePath(base);
  // check typescript service worker for injectManifest strategy
  const scope = options.scope || basePath;

  let assetsDir = slash(viteConfig.build.assetsDir ?? "assets");
  if (assetsDir[assetsDir.length - 1] !== "/") assetsDir += "/";

  // remove './' prefix from assetsDir
  const dontCacheBustURLsMatching = new RegExp(`^${assetsDir.replace(/^\.*?\//, "")}`);

  const { plugins = [], rollupOptions = {}, rollupFormat = "es", swUrl = "/sw.js", swSrc, swDest, ...userInjectManifest } = injectManifest || {};

  if (!devOptions.enabled || viteConfig.command !== "serve") {
    devOptions.enabled = false;
    devOptions.type = "classic";
  }
  const resolvedPluginOptions = {
    base: basePath,
    mode,
    injectRegister,
    registerType,
    useCredentials,
    swUrl,
    injectManifest: {
      dontCacheBustURLsMatching,
      swSrc: path.resolve(viteConfig.root, swSrc),
      swDest: path.resolve(viteConfig.root, viteConfig.build.outDir, swDest),
      ...userInjectManifest,
    },
    scope,
    minify,
    includeAssets,
    disable,
    integration,
    devOptions,
    buildBase: buildBase ?? basePath,
    injectManifestRollupOptions: {
      plugins,
      rollupOptions,
      format: rollupFormat,
    },
  } satisfies ResolvedPluginOptions;

  // calculate hash only when required
  const calculateHash =
    !resolvedPluginOptions.disable &&
    resolvedPluginOptions.includeAssets &&
    (viteConfig.command === "build" || resolvedPluginOptions.devOptions.enabled);

  if (calculateHash) await configureStaticAssets(resolvedPluginOptions, viteConfig);

  return resolvedPluginOptions;
};
