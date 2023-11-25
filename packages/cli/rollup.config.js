// @ts-check
import { getRollupOptions } from "@serwist/constants/rollup";

import packageJson from "./package.json" assert { type: "json" };

const isDev = process.env.NODE_ENV === "development";

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: "src/bin.ts",
      output: [
        {
          file: "dist/bin.js",
          format: "esm",
        },
      ],
    },
  ],
  shouldMinify: !isDev,
  shouldEmitDeclaration: false,
});
