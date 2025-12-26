// @ts-check
import { getRollupOptions } from "@serwist/configs/rollup";

import packageJson from "./package.json" with { type: "json" };

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: {
        index: "src/index.ts",
        "index.config": "src/index.config.ts",
        "index.react": "src/index.react.tsx",
        "index.schema": "src/index.schema.ts",
        "index.worker": "src/index.worker.ts",
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
