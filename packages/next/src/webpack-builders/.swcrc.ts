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
