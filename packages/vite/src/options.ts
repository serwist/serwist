import path from "node:path";
import process from "node:process";

import { validateInjectManifestOptions } from "@serwist/build";
import type { ResolvedConfig } from "vite";

import { configureStaticAssets } from "./assets.js";
import type { PluginOptions, ResolvedPluginOptions } from "./types.js";
import { resolveBasePath, slash } from "./utils.js";

export const resolveOptions = async (options: PluginOptions, viteConfig: ResolvedConfig): Promise<ResolvedPluginOptions> => {
  const {
    type = "classic",
    mode = (process.env.NODE_ENV || "production") as "production" | "development",
    injectRegister = "auto",
    registerType = "prompt",
    minify = true,
    base = viteConfig.base,
    scope: _scope,
    swUrl = "/sw.js",
    includeAssets = undefined,
    useCredentials = false,
    disable = false,
    integration = {},
    buildBase,
    devOptions,
    plugins = [],
    rollupOptions = {},
    rollupFormat = "es",
    ...injectManifest
  } = options;

  const basePath = resolveBasePath(base);
  // check typescript service worker for injectManifest strategy
  const scope = _scope || basePath;

  let assetsDir = slash(viteConfig.build.assetsDir ?? "assets");
  if (assetsDir[assetsDir.length - 1] !== "/") assetsDir += "/";

  const resolvedDevOptions: ResolvedPluginOptions["devOptions"] = {
    bundle: true,
    minify: false,
    ...devOptions,
  };

  // remove './' prefix from assetsDir
  const dontCacheBustURLsMatching = new RegExp(`^${assetsDir.replace(/^\.*?\//, "")}`);

  validateInjectManifestOptions(injectManifest);

  const { swSrc, swDest, ...userInjectManifest } = injectManifest || {};

  const resolvedPluginOptions = {
    base: basePath,
    type,
    mode,
    injectRegister,
    registerType,
    useCredentials,
    swUrl,
    injectManifest: {
      dontCacheBustURLsMatching,
      ...userInjectManifest,
      swSrc: path.resolve(viteConfig.root, swSrc),
      swDest: path.resolve(viteConfig.root, viteConfig.build.outDir, swDest),
      disablePrecacheManifest: !viteConfig.isProduction,
    },
    scope,
    minify,
    includeAssets,
    disable,
    integration,
    buildBase: buildBase ?? basePath,
    injectManifestRollupOptions: {
      plugins,
      rollupOptions,
      format: rollupFormat,
    },
    devOptions: resolvedDevOptions,
  } satisfies ResolvedPluginOptions;

  // calculate hash only when required
  const calculateHash = !resolvedPluginOptions.disable && resolvedPluginOptions.includeAssets && viteConfig.command === "build";

  if (calculateHash) await configureStaticAssets(resolvedPluginOptions, viteConfig);

  return resolvedPluginOptions;
};
