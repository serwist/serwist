import path from "node:path";
import { resolveEntry } from "@serwist/utils/node";
import type { ResolvedConfig } from "vite";
import type { PluginOptions as VitePluginOptions } from "vite-plugin-serwist";
import type { SerwistReactRouterContext } from "./context.js";
import type { PluginOptions } from "../types.js";

export const resolveDefaultOptions = (
  ctx: SerwistReactRouterContext,
  userOptions: PluginOptions,
  viteConfig: ResolvedConfig,
): VitePluginOptions | undefined => {
  if (!ctx.reactRouterPluginContext) {
    return undefined;
  }
  const reactRouterConfig = ctx.reactRouterPluginContext.reactRouterConfig;
  const appDirectory = path.relative(viteConfig.root, reactRouterConfig.appDirectory);
  const buildDirectory = path.relative(viteConfig.root, reactRouterConfig.buildDirectory);
  let swSrc = userOptions.swSrc;
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
    ...userOptions,
    swSrc,
    // Since `vite-plugin-serwist` sees `outDir` as build/server, we
    // have to set `swDest` such that it points to build/client instead.
    swDest: path.join("../client", userOptions.swDest || "sw.js"),
    manifestTransforms: [
      (manifestEntries) => {
        const manifest = manifestEntries.map((e) => {
          // If `basename` is set, "index.html" would be "base/index.html",
          // so this case is skipped.
          if (e.url === "index.html") {
            e.url = "/";
          } else if (e.url.endsWith("index.html")) {
            // "base/abc/index.html" -> "/base/abc"
            e.url = `/${e.url.slice(0, e.url.lastIndexOf("/"))}`;
          } else {
            // Prepend `viteConfig.base`.
            // "/path.json" -> "/base/path.json"
            e.url = path.posix.join(viteConfig.base, e.url);
          }
          return e;
        });
        return { manifest, warnings: [] };
      },
      ...(userOptions.manifestTransforms ?? []),
    ],
  } satisfies PluginOptions;
};
