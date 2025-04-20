// @ts-check
import { getRollupOptions } from "@serwist/configs/rollup";

import packageJson from "./package.json" with { type: "json" };

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: {
        index: "src/index.ts",
        "index.worker": "src/index.worker.ts",
        "index.schema": "src/index.schema.ts",
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
