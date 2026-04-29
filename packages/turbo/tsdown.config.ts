import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: {
    index: "src/index.ts",
    "index.react": "src/index.react.tsx",
    "index.schema": "src/index.schema.ts",
    "index.worker": "src/index.worker.ts",
  },
  dts: {
    sourcemap: true,
  },
};

export default config;
