import { resolveBasePath, slash } from "@serwist/utils";
import path from "node:path";
import type { ResolvedConfig } from "vite";
import type { PluginOptions, PluginOptionsComplete } from "./types.js";
import { validateInjectManifestOptions } from "./validator.js";

export const resolveOptions = async (userOptions: PluginOptions, viteConfig: ResolvedConfig): Promise<PluginOptionsComplete> => {
  const base = resolveBasePath(viteConfig.base);
  if (!userOptions.base) userOptions.base = base;
  if (!userOptions.scope) userOptions.scope = base;

  const validated = await validateInjectManifestOptions(userOptions);

  if (!validated.injectManifest.dontCacheBustURLsMatching) {
    let assetsDir = slash(viteConfig.build.assetsDir ?? "assets");
    if (assetsDir[assetsDir.length - 1] !== "/") assetsDir += "/";
    validated.injectManifest.dontCacheBustURLsMatching = new RegExp(`^${assetsDir.replace(/^\.*?\//, "")}`);
  }

  return {
    ...validated,
    injectManifest: {
      ...validated.injectManifest,
      swSrc: path.resolve(viteConfig.root, validated.injectManifest.swSrc),
      swDest: path.resolve(viteConfig.root, viteConfig.build.outDir, validated.injectManifest.swDest),
      disablePrecacheManifest: !viteConfig.isProduction,
    },
  };
};
