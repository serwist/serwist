// @ts-check
import { getRollupOptions } from "@serwist/constants/rollup";

import packageJson from "./package.json" assert { type: "json" };

const isDev = process.env.NODE_ENV === "development";

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: "src/index.ts",
      output: [
        {
          file: "dist/index.cjs",
          format: "cjs",
          exports: "named",
        },
        {
          file: "dist/index.module.js",
          format: "esm",
        },
      ],
    },
    {
      input: "src/fallback.ts",
      output: {
        file: "dist/fallback.js",
        format: "cjs",
      },
    },
    {
      input: "src/sw-entry.ts",
      output: {
        file: "dist/sw-entry.js",
        format: "esm",
      },
    },
    {
      input: "src/sw-entry-worker.ts",
      output: {
        file: "dist/sw-entry-worker.js",
        format: "esm",
      },
    },
    {
      input: "src/swc-loader.ts",
      output: {
        file: "dist/swc-loader.cjs",
        format: "cjs",
      },
    },
  ],
  dtsFiles: [
    {
      input: "dist/dts/src/index.d.ts",
      output: [
        { format: "es", file: "dist/index.module.d.ts" },
        { format: "cjs", file: "dist/index.d.cts" },
      ],
    },
    {
      input: "dist/dts/src/sw-entry.d.ts",
      output: [
        { format: "es", file: "dist/sw-entry.module.d.ts" },
        { format: "cjs", file: "dist/sw-entry.d.cts" },
      ],
    },
  ],
  shouldMinify: !isDev,
  shouldEmitDeclaration: !isDev,
});
