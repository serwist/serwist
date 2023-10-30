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
          file: "dist/index.js",
          format: "esm",
        },
      ],
    },
    {
      input: "src/_private/index.ts",
      output: [
        {
          file: "dist/private.js",
          format: "esm",
        },
      ],
    },
  ],
  dtsFiles: [
    {
      input: "dist/dts/index.d.ts",
      output: [{ format: "es", file: "dist/index.d.ts" }],
    },
    {
      input: "dist/dts/_private/index.d.ts",
      output: [{ format: "es", file: "dist/private.d.ts" }],
    },
    {
      input: "dist/dts/types.d.ts",
      output: [{ format: "es", file: "dist/types.d.ts" }],
    },
  ],
  shouldMinify: !isDev,
  shouldEmitDeclaration: !isDev,
});
