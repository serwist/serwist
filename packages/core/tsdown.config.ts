import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: {
    index: "src/index.ts",
    "index.legacy": "src/index.legacy.ts",
    "index.internal": "src/index.internal.ts",
  },
  dts: {
    sourcemap: true,
  },
};

export default config;
