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
        "client/index.preact": "src/client/index.preact.ts",
        "client/index.react": "src/client/index.react.ts",
        "client/index.solid": "src/client/index.solid.ts",
        "client/index.svelte": "src/client/index.svelte.ts",
        "client/index.vue": "src/client/index.vue.ts",
      },
      output: {
        dir: "dist",
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        format: "esm",
      },
      external: ["virtual:serwist"],
    },
  ],
});
