// @ts-check
import { getRollupOptions } from "@serwist/constants/rollup";

import packageJson from "./package.json" assert { type: "json" };

const isDev = process.env.NODE_ENV === "development";

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: {
        index: "src/index.ts",
        "index.browser": "src/index.browser.ts",
        "sw-entry": "src/sw-entry.ts",
        "sw-entry-worker": "src/sw-entry-worker.ts",
      },
      output: [
        {
          dir: "dist",
          entryFileNames: "[name].cjs",
          format: "cjs",
          exports: "named",
        },
        {
          dir: "dist",
          entryFileNames: "[name].js",
          format: "esm",
        },
      ],
    },
  ],
  shouldEmitDeclaration: !isDev,
});
