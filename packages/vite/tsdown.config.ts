import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: {
    index: "src/index.ts",
    "index.worker": "src/index.worker.ts",
    "index.schema": "src/index.schema.ts",
  },
  dts: {
    sourcemap: true,
  },
};

export default config;
