// @ts-check
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import { defineConfig } from "rollup";

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
            extensions: [".js", ".ts"],
          }),
          json(),
          swc({
            swc: swcConfig,
          }),
          ...[plugins ?? []],
        ],
      }),
    ),
  ];
};
