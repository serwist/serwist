import path from "node:path";
import { resolveEntry } from "@serwist/utils/node";
import type { ResolvedConfig as ResolvedViteConfig } from "vite";
import type { ResolvedReactRouterConfig } from "./types.js";
import type { InjectManifestOptions, InjectManifestOptionsResolved } from "../types.js";

export const resolveDefaultOptions = (
  viteConfig: ResolvedViteConfig,
  reactRouterConfig: ResolvedReactRouterConfig,
  config: InjectManifestOptions,
) => {
  const appDirectory = path.relative(viteConfig.root, reactRouterConfig.appDirectory);
  const buildDirectory = path.relative(viteConfig.root, reactRouterConfig.buildDirectory);
  let swSrc = config.swSrc;
  if (!swSrc) {
    const defaultSwSrc = resolveEntry(path.join(appDirectory, "sw"));
    if (defaultSwSrc) {
      swSrc = defaultSwSrc;
    } else {
      throw new Error("`swSrc` is not defined.");
    }
  }
  return {
    globDirectory: path.join(buildDirectory, "client"),
    dontCacheBustURLsMatching: /assets\//,
    ...config,
    swSrc,
    swDest: config.swDest || path.join(buildDirectory, "client/sw.js"),
  } satisfies InjectManifestOptionsResolved;
};
