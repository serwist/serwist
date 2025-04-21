import path from "node:path";
import { resolveEntry } from "@serwist/utils/node";
import type { AstroConfig } from "astro";
import type { PluginOptions as VitePluginOptions } from "vite-plugin-serwist";
import type { PluginOptions } from "../types.js";
import { fileURLToPath } from "node:url";

export const resolveDefaultOptions = (astroConfig: AstroConfig, options: PluginOptions): VitePluginOptions => {
  const srcDir = fileURLToPath(astroConfig.srcDir);
  const outDir = fileURLToPath(astroConfig.outDir);
  let swSrc = options.swSrc;
  if (!swSrc) {
    const defaultSwSrc = resolveEntry(path.join(srcDir, "sw"));
    if (defaultSwSrc) {
      swSrc = defaultSwSrc;
    } else {
      throw new Error("`swSrc` is not defined.");
    }
  }
  return {
    globDirectory: outDir,
    dontCacheBustURLsMatching: /_astro\//,
    ...options,
    swSrc,
    swDest: path.join(outDir, options.swDest || "sw.js"),
    manifestTransforms: [
      (manifestEntries) => {
        const manifest = manifestEntries.map((e) => {
          if (e.url === "index.html") {
            e.url = astroConfig.base;
          } else {
            const isDirectoryBuild = astroConfig.build.format === "directory";
            // build.format = "directory":
            // - "a/index.html" -> "/base/a"
            // build.format = "preserve":
            // - "a/index.html" -> "/base/a/index"
            // - "a.html" -> "/base/a"
            // build.format = "file":
            // - "a.html" -> "/base/a"
            const endIndex = e.url.lastIndexOf(isDirectoryBuild ? "/index.html" : ".html");
            e.url = path.posix.join(astroConfig.base, endIndex > 0 ? e.url.slice(0, endIndex) : e.url);
            if (astroConfig.trailingSlash === "always") e.url += "/";
          }
          return e;
        });
        return { manifest, warnings: [] };
      },
      ...(options.manifestTransforms ?? []),
    ],
  } satisfies PluginOptions;
};
