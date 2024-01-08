// @ts-check
import { getRollupOptions } from "@serwist/constants/rollup";

import packageJson from "./package.json" assert { type: "json" };

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: {
        index: "src/index.ts",
        "index.internal": "src/index.internal.ts",
      },
      output: [
        {
          dir: "dist",
          entryFileNames: "[name].cjs",
          chunkFileNames: "[name].cjs",
          format: "cjs",
          exports: "named",
        },
        {
          dir: "dist",
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          format: "esm",
        },
      ],
    },
  ],
  shouldEmitDeclaration: true,
});
