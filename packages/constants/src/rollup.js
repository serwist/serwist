/* eslint-disable import/no-extraneous-dependencies */
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

import { swcConfig } from "./swc-config.js";

/**
 * @type {typeof import("./rollup.d.ts").getRollupOptions}
 */
export const getRollupOptions = ({
  packageJson,
  jsFiles,
  dtsFiles,
  shouldMinify,
  shouldEmitDeclaration,
}) => {
  const forcedExternals = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
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
        external: [
          ...(Array.isArray(external) ? external : [external]),
          ...forcedExternals,
        ],
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
              declarationDir: "dts",
            }),
          swc({
            swc: {
              ...swcConfig,
              minify: shouldMinify,
            },
          }),
          ...[plugins ?? []],
        ],
      })
    );
  }

  if (shouldEmitDeclaration) {
    for (const { input, output, external = [], plugins } of dtsFiles) {
      rollupEntries.push(
        defineConfig({
          input,
          output,
          external: [
            ...(Array.isArray(external) ? external : [external]),
            ...forcedExternals,
          ],
          plugins: [dts(), ...[plugins ?? []]],
        })
      );
    }
  }

  return rollupEntries;
};
