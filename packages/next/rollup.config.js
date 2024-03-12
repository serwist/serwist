// @ts-check
import { getRollupOptions } from "@serwist/constants/rollup";

import packageJson from "./package.json" assert { type: "json" };

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: {
        index: "src/index.ts",
        "index.worker": "src/index.worker.ts",
        "index.schema": "src/index.schema.ts",
        "sw-entry": "src/sw-entry.ts",
        "sw-entry-worker": "src/sw-entry-worker.ts",
      },
      output: {
        dir: "dist",
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        format: "esm",
      },
    },
  ],
});
