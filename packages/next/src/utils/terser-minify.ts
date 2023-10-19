import type {
  Compiler,
  JsMinifyOptions,
  TerserCompressOptions,
} from "@swc/core";
import type {
  CustomOptions,
  default as TerserWebpack,
  ExtractCommentsOptions,
  Input,
  MinimizedResult,
  PredefinedOptions,
  SourceMapInput,
} from "terser-webpack-plugin";

import type { resolveSwc as SwcResolver } from "./resolve-swc.js";

/**
 * Custom `terser-webpack-plugin` minifier
 * @param input
 * @param sourceMap
 * @param minimizerOptions
 * @return
 */
export const terserMinify = async (
  input: Input,
  sourceMap: SourceMapInput | undefined,
  options: PredefinedOptions & CustomOptions,
  extractComments: ExtractCommentsOptions | undefined
): Promise<MinimizedResult> => {
  const { resolveSwc, useSwcMinify, ...minimizerOptions } =
    options as typeof options & {
      resolveSwc: typeof SwcResolver;
      useSwcMinify: boolean | undefined;
    };

  const fallbackToTerser = () => {
    return (
      require("terser-webpack-plugin") as typeof TerserWebpack
    ).terserMinify(input, sourceMap, minimizerOptions, extractComments);
  };

  if (useSwcMinify) {
    const buildSwcOptions = (
      swcOptions: PredefinedOptions & JsMinifyOptions
    ): JsMinifyOptions & {
      sourceMap: boolean | undefined;
      compress: TerserCompressOptions;
    } => ({
      ...swcOptions,
      compress:
        typeof swcOptions.compress === "boolean"
          ? swcOptions.compress
            ? {}
            : false
          : { ...swcOptions.compress },
      mangle:
        swcOptions.mangle == null
          ? true
          : typeof swcOptions.mangle === "boolean"
          ? swcOptions.mangle
          : { ...swcOptions.mangle },
      sourceMap: undefined,
    });

    let swc: Compiler;
    try {
      swc = resolveSwc();
    } catch {
      // swc might not be available, fallback to terser
      return fallbackToTerser();
    }

    if (!swc.minify) {
      // turns out that older versions of Next had `next/dist/build/swc` with no `swc.minify`...
      return fallbackToTerser();
    }

    // Copy `swc` options
    const swcOptions = buildSwcOptions(minimizerOptions);

    // Let `swc` generate a SourceMap
    if (sourceMap) {
      swcOptions.sourceMap = true;
    }

    if (swcOptions.compress) {
      // More optimizations
      if (typeof swcOptions.compress.ecma === "undefined") {
        swcOptions.compress.ecma = swcOptions.ecma;
      }

      if (
        swcOptions.ecma === 5 &&
        typeof swcOptions.compress.arrows === "undefined"
      ) {
        swcOptions.compress.arrows = false;
      }
    }

    const [[filename, code]] = Object.entries(input);
    const result = await swc.minify(code, swcOptions);

    let map;

    if (result.map) {
      map = JSON.parse(result.map);

      // TODO workaround for swc because `filename` is not preset as in `swc` signature as for `terser`
      map.sources = [filename];

      delete map.sourcesContent;
    }

    return {
      code: result.code,
      map,
    };
  }

  return fallbackToTerser();
};
