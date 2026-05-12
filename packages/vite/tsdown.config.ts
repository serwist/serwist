import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: {
    // index: "src/index.ts",
    "index.worker": "src/index.worker.ts",
    "index.schema": "src/index.schema.ts",
    "client/index.preact": "src/client/index.preact.ts",
    "client/index.react": "src/client/index.react.ts",
    "client/index.solid": "src/client/index.solid.ts",
    "client/index.svelte": "src/client/index.svelte.ts",
    "client/index.vue": "src/client/index.vue.ts",
  },
  deps: { onlyBundle: [], neverBundle: ["virtual:serwist"] },
  outputOptions: { chunkFileNames: "chunks/[name]-[hash].js" },
  dts: { sourcemap: true },
};

export default config;
