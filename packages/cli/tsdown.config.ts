import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: {
    index: "src/index.ts",
    "index.schema": "src/index.schema.ts",
    bin: "src/bin.ts",
  },
  dts: {
    sourcemap: true,
  },
};

export default config;
