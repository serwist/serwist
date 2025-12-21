// @ts-check
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import svelte from "rollup-plugin-svelte";

import { swcConfig } from "./swc-config.js";

/**
 * @type {typeof import("./rollup.d.ts").getRollupOptions}
 */
export const getRollupOptions = ({ packageJson, jsFiles }) => {
  const forcedExternals = [
    ...Object.keys(packageJson.dependencies ?? {}).map((e) => new RegExp(`^${e}`)),
    ...Object.keys(packageJson.peerDependencies ?? {}).map((e) => new RegExp(`^${e}`)),
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
            extensions: [".mjs", ".js", ".ts", ".cjs", ".json", ".node"],
          }),
          json(),
          swc({
            swc: swcConfig,
          }),
          typescript({
            noForceEmit: true,
            noEmit: false,
            emitDeclarationOnly: true,
            outDir: "dist",
            declaration: true,
            declarationMap: true,
          }),
          svelte({
            extensions: [".svelte", ".svelte.ts", ".svelte.js"],
          }),
          ...[plugins ?? []],
        ],
      }),
    ),
  ];
};
