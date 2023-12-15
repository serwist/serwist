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
          file: "dist/index.old.cjs",
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
      input: "src/index.browser.ts",
      output: [
        {
          file: "dist/index.browser.old.cjs",
          format: "cjs",
          exports: "named",
        },
        {
          file: "dist/index.browser.js",
          format: "esm",
        },
      ],
    },
    {
      input: "src/sw-entry.ts",
      output: [
        {
          file: "dist/sw-entry.old.cjs",
          format: "cjs",
          exports: "named",
        },
        {
          file: "dist/sw-entry.js",
          format: "esm",
        },
      ],
    },
    {
      input: "src/sw-entry-worker.ts",
      output: {
        file: "dist/sw-entry-worker.js",
        format: "esm",
      },
    },
  ],
  shouldEmitDeclaration: !isDev,
});
