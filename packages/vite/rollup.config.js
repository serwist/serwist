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
        "client/preact": "src/client/preact.ts",
        "client/react": "src/client/react.ts",
        "client/solid": "src/client/solid.ts",
        "client/index.svelte": "src/client/index.svelte.ts",
        "client/vue": "src/client/vue.ts",
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
