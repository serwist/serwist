import type { Options } from "@swc/core";

/**
 * Our default `.swcrc`. Manually inject `env.targets` before use (this is done
 * automatically if you use `getSharedWebpackConfig`).
 */
export const defaultSwcRc: Options = {
  module: {
    type: "es6",
  },
  jsc: {
    minify: {
      compress: {
        ecma: 5,
        comparisons: false,
        inline: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        ecma: 5,
        safari10: true,
        comments: false,
        ascii_only: true,
      },
    },
    parser: {
      syntax: "typescript",
      tsx: false,
      dynamicImport: true,
      decorators: false,
    },
    loose: false,
  },
  minify: false,
};
