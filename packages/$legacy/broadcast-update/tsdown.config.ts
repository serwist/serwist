import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: {
    index: "src/index.ts",
  },
  deps: { onlyBundle: [] },
  outputOptions: { chunkFileNames: "chunks/[name]-[hash].js" },
  dts: { sourcemap: true },
};

export default config;
