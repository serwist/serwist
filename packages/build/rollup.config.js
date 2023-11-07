// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getRollupOptions } from "@serwist/constants/rollup";
import { glob } from "glob";

import packageJson from "./package.json" assert { type: "json" };

const isDev = process.env.NODE_ENV === "development";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const libTs = await glob("*.ts", {
  cwd: path.join(__dirname, "src/lib"),
});

const libJs = libTs.map((file) => {
  const parsedFilename = path.parse(file);
  return /** @type {import("@serwist/constants/rollup").FileEntry} */ ({
    input: `src/lib/${parsedFilename.base}`,
    output: [
      {
        file: `dist/lib/${parsedFilename.name}.module.js`,
        format: "esm",
      },
      {
        file: `dist/lib/${parsedFilename.name}.cjs`,
        format: "cjs",
        exports: "named"
      },
    ],
    external: ["lodash/template.js"]
  });
});

const libDts = libTs.map((file) => {
  const parsedFilename = path.parse(file);
  return /** @type {import("@serwist/constants/rollup").FileEntry} */ ({
    input: `dist/dts/lib/${parsedFilename.name}.d.ts`,
    output: [
      {
        file: `dist/lib/${parsedFilename.name}.module.d.ts`,
        format: "esm",
      },
      {
        file: `dist/lib/${parsedFilename.name}.d.cts`,
        format: "cjs",
      },
    ],
  });
});

export default getRollupOptions({
  packageJson,
  jsFiles: [
    {
      input: "src/index.ts",
      output: [
        {
          file: "dist/index.cjs",
          format: "cjs",
          exports: "named",
        },
        {
          file: "dist/index.module.js",
          format: "esm",
        },
      ],
      external: ["lodash/template.js"]
    },
    ...libJs,
  ],
  dtsFiles: [
    {
      input: "dist/dts/index.d.ts",
      output: [
        { format: "es", file: "dist/index.module.d.ts" },
        { format: "cjs", file: "dist/index.d.cts" },
      ],
    },
    ...libDts
  ],
  shouldMinify: !isDev,
  shouldEmitDeclaration: !isDev,
});
