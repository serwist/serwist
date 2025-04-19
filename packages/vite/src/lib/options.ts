import path from "node:path";
import process from "node:process";

import { resolveBasePath, slash } from "@serwist/utils";
import type { ResolvedConfig } from "vite";

import type { PluginOptions, PluginOptionsComplete } from "./types.js";
import { validateInjectManifestOptions } from "./validator.js";

const prepareConfigForValidation = (
  viteConfig: ResolvedConfig,
  {
    mode = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development" ? process.env.NODE_ENV : "production",
    base = viteConfig.base,
    scope: _scope,
    devOptions,
    ...injectManifest
  }: PluginOptions,
) => {
  const basePath = resolveBasePath(base);
  return {
    mode,
    base: basePath,
    scope: _scope || basePath,
    devOptions,
    ...injectManifest,
  };
};

export const resolveOptions = async (options: PluginOptions, viteConfig: ResolvedConfig): Promise<PluginOptionsComplete> => {
  const {
    mode,
    type,
    scope,
    base,
    disable,
    integration,
    swUrl,
    swSrc,
    swDest,
    plugins,
    rollupFormat,
    rollupOptions,
    devOptions,
    ...userInjectManifest
  } = await validateInjectManifestOptions(prepareConfigForValidation(viteConfig, options));

  let assetsDir = slash(viteConfig.build.assetsDir ?? "assets");
  if (assetsDir[assetsDir.length - 1] !== "/") assetsDir += "/";

  // remove './' prefix from assetsDir
  const dontCacheBustURLsMatching = new RegExp(`^${assetsDir.replace(/^\.*?\//, "")}`);

  const resolvedPluginOptions = {
    mode,
    type,
    scope,
    base,
    disable,
    integration,
    swUrl,
    plugins,
    rollupFormat,
    rollupOptions,
    devOptions,
    injectManifest: {
      dontCacheBustURLsMatching,
      ...userInjectManifest,
      swSrc: path.resolve(viteConfig.root, swSrc),
      swDest: path.resolve(viteConfig.root, viteConfig.build.outDir, swDest),
      disablePrecacheManifest: !viteConfig.isProduction,
    },
  } satisfies PluginOptionsComplete;

  return resolvedPluginOptions;
};
