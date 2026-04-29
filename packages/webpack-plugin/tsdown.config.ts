import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: {
    index: "src/index.ts",
    "index.internal": "src/index.internal.ts",
    "index.schema": "src/index.schema.ts",
  },
  deps: { onlyBundle: [] },
  outputOptions: { chunkFileNames: "chunks/[name]-[hash].js" },
  dts: { sourcemap: true },
};

export default config;
