import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: {
    index: "src/index.ts",
  },
  dts: {
    sourcemap: true,
  },
};

export default config;
