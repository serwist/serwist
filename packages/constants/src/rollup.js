// @ts-check
import fs from "node:fs";
import { copyFile } from "node:fs/promises";

import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import typescript from "@rollup/plugin-typescript";
import fg from "fast-glob";
import { defineConfig } from "rollup";

import { swcConfig } from "./swc-config.js";

const isPublishMode = process.env.PUBLISH === "true";

/**
 * @returns {import("rollup").Plugin}
 */
function emitDCts() {
  return {
    name: "emitDCts",
    writeBundle: {
      sequential: true,
      order: "post",
      async handler({ file, format, dir }) {
        if (!!file && /dist\/.*?(\.cjs)/.test(file)) {
          return fs.copyFileSync(file.replace(".cjs", ".d.ts"), file.replace(".cjs", ".d.cts"));
        }
        if (file === undefined && format === "cjs" && dir === "dist") {
          await Promise.all((await fg("dist/**/*.d.ts")).map(async (file) => await copyFile(file, file.replace(".d.ts", ".d.cts"))));
          return;
        }
      },
    },
  };
}

/**
 * @type {typeof import("./rollup.d.ts").getRollupOptions}
 */
export const getRollupOptions = ({ packageJson, jsFiles, shouldEmitDeclaration }) => {
  const forcedExternals = [
    ...Object.keys(packageJson.dependencies ?? {}).map((e) => new RegExp("^" + e)),
    ...Object.keys(packageJson.peerDependencies ?? {}).map((e) => new RegExp("^" + e)),
  ];

  return [
    ...jsFiles.map(({ input, output, external = [], plugins }) =>
      defineConfig({
        input,
        output,
        external: [...(Array.isArray(external) ? external : [external]), ...forcedExternals],
        plugins: [
          nodeResolve({
            exportConditions: ["node"],
            preferBuiltins: true,
            extensions: [".js", ".ts"],
          }),
          json(),
          swc({
            swc: swcConfig,
          }),
          shouldEmitDeclaration &&
            typescript({
              noForceEmit: true,
              noEmit: false,
              emitDeclarationOnly: true,
              outDir: "dist",
              declaration: true,
              declarationMap: !isPublishMode,
            }),
          emitDCts(),
          ...[plugins ?? []],
        ],
      })
    ),
  ];
};
