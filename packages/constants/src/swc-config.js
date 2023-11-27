/* eslint-disable import/no-extraneous-dependencies */

/** @type {import("./swc-config.d.ts").swcConfig} */
export const swcConfig = {
  module: {
    type: "nodenext",
  },
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: false,
      dynamicImport: true,
      decorators: false,
    },
    target: "esnext",
    loose: false,
  },
  minify: false,
};
