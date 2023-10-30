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
      input: "src/initialize.ts",
      output: [
        {
          file: "dist/initialize.cjs",
          format: "cjs",
          exports: "named",
        },
        {
          file: "dist/initialize.module.js",
          format: "esm",
        },
      ],
    },
  ],
  dtsFiles: [
    {
      input: "dist/dts/index.d.ts",
      output: [
        { format: "es", file: "dist/index.module.d.ts" },
        { format: "cjs", file: "dist/index.d.cts" },
      ],
    },
    {
      input: "dist/dts/initialize.d.ts",
      output: [
        { format: "es", file: "dist/initialize.module.d.ts" },
        { format: "cjs", file: "dist/initialize.d.cts" },
      ],
    },
  ],
  shouldMinify: !isDev,
  shouldEmitDeclaration: !isDev,
});
