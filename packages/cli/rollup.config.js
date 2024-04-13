// @ts-check
import { getRollupOptions } from "@serwist/configs/rollup";

import packageJson from "./package.json" assert { type: "json" };

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: {
        bin: "src/bin.ts",
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
