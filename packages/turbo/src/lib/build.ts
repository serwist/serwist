import { browserslistToEsbuild } from "@serwist/utils";
import browserslist from "browserslist";
import { MODERN_BROWSERSLIST_TARGET } from "next/constants.js";
import type { InjectManifestOptionsComplete } from "../types.js";
import { DEV } from "./constants.js";

export const build = (
  esbuild: typeof import("esbuild"),
  config: InjectManifestOptionsComplete,
  injectionPoint: string,
  manifestString: string,
) =>
  esbuild.build({
    sourcemap: true,
    format: "esm",
    treeShaking: true,
    minify: !DEV,
    bundle: true,
    ...config.esbuildOptions,
    target:
      config.esbuildOptions?.target ??
      browserslistToEsbuild(
        browserslist,
        config.cwd,
        MODERN_BROWSERSLIST_TARGET,
      ),
    platform: "browser",
    define: {
      ...config.esbuildOptions.define,
      ...(injectionPoint ? { [injectionPoint]: manifestString } : {}),
    },
    outdir: config.cwd,
    write: false,
    entryNames: "[name]",
    // Asset and chunk names must be at the top, as our path is `/serwist/[path]`,
    // not `/serwist/[...path]`, meaning that we can't resolve paths deeper
    // than one level.
    assetNames: "[name]-[hash]",
    chunkNames: "[name]-[hash]",
    entryPoints: [{ in: config.swSrc, out: "sw" }],
  });
