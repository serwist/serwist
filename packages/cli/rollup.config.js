// @ts-check
import { getRollupOptions } from "@serwist/constants/rollup";

import packageJson from "./package.json" assert { type: "json" };

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: "src/bin.ts",
      output: [
        {
          file: "dist/bin.js",
          format: "esm",
        },
      ],
    },
  ],
  shouldEmitDeclaration: false,
});
