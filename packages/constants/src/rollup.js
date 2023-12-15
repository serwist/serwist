import fs from "node:fs";

import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import typescript from "@rollup/plugin-typescript";
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
      handler({ file }) {
        if (/dist\/.*?\.old(\.cjs)/.test(file)) {
          fs.copyFileSync(file.replace(".old.cjs", ".d.ts"), file.replace(".old.cjs", ".old.d.cts"));
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

  /**
   * @type {import("rollup").RollupOptions[]}
   */
  const rollupEntries = [];

  for (const { input, output, external = [], plugins } of jsFiles) {
    rollupEntries.push(
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
          shouldEmitDeclaration &&
            typescript({
              noForceEmit: true,
              noEmit: false,
              emitDeclarationOnly: true,
              outDir: "dist",
              declaration: true,
              declarationMap: !isPublishMode,
            }),
          swc({
            swc: swcConfig,
          }),
          emitDCts(),
          ...[plugins ?? []],
        ],
      })
    );
  }

  return rollupEntries;
};
