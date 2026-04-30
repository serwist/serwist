import pluginBabel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import type { UserConfig } from "tsdown";

const config: UserConfig = {
  entry: {
    index: "src/index.ts",
    "index.config": "src/index.config.ts",
    "index.react": "src/index.react.tsx",
    "index.schema": "src/index.schema.ts",
    "index.worker": "src/index.worker.ts",
    "sw-entry": "src/sw-entry.ts",
    "sw-entry-worker": "src/sw-entry-worker.ts",
  },
  deps: { onlyBundle: [] },
  plugins: [
    pluginBabel({
      presets: [reactCompilerPreset()],
    }),
  ],
  outputOptions: { chunkFileNames: "chunks/[name]-[hash].js" },
  dts: { sourcemap: true },
};

export default config;
