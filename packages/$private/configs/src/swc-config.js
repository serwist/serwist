/* eslint-disable import/no-extraneous-dependencies */

/** @type {import("./swc-config.d.ts").swcConfig} */
export const swcConfig = {
  module: {
    type: "nodenext",
  },
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
      dynamicImport: true,
      decorators: false,
    },
    transform: {
      react: {
        runtime: "automatic",
      },
    },
    target: "esnext",
    loose: false,
    minify: {
      compress: false,
      mangle: false,
    },
  },
  minify: false,
};
