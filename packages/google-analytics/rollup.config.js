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
          file: "dist/index.js",
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
          file: "dist/initialize.js",
          format: "esm",
        },
      ],
    },
  ],
  shouldEmitDeclaration: !isDev,
});
