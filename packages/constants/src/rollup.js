import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

import { swcConfig } from "./swc-config.js";

const isPublishMode = process.env.PUBLISH === "true";

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
          ...[plugins ?? []],
        ],
      })
    );
  }

  return rollupEntries;
};
