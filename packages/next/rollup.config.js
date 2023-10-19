// @ts-check
/**
 * @typedef {Pick<
 *  import("rollup").RollupOptions,
 *  "input" | "output" | "plugins"
 * > & {
 *   external?: (string | RegExp)[] | string | RegExp;
 * }} FileEntry
 */
import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

import packageJson from "./package.json" assert { type: "json" };
import { swcConfig } from "./swc-config.js";

const isDev = process.env.NODE_ENV !== "production";
const shouldEmitDeclaration = !isDev;
const forcedExternals = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
];

/** @type {FileEntry[]} */
const files = [
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
  },
  {
    input: "src/fallback.ts",
    output: {
      file: "dist/fallback.js",
      format: "cjs",
    },
  },
  {
    input: "src/sw-entry.ts",
    output: {
      file: "dist/sw-entry.js",
      format: "esm",
    },
  },
  {
    input: "src/sw-entry-worker.ts",
    output: {
      file: "dist/sw-entry-worker.js",
      format: "esm",
    },
  },
  {
    input: "src/swc-loader.ts",
    output: {
      file: "dist/swc-loader.cjs",
      format: "cjs",
    },
  },
];

/**
 * @type {import("rollup").RollupOptions[]}
 */
const rollupEntries = [];

for (const { input, output, external = [], plugins } of files) {
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
        // ensure compatibility by removing `node:` protocol (this MUST
        // exclude "node: protocol"-only core modules such as `node:test`).
        alias({
          entries: [{ find: /node:(?!test)(.*)$/, replacement: "$1" }],
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
            minify: !isDev,
          },
        }),
        ...[plugins ?? []],
      ],
    })
  );
}

if (shouldEmitDeclaration) {
  /** @type {FileEntry[]} */
  const declarations = [
    {
      input: "dist/dts/src/index.d.ts",
      output: [
        { format: "es", file: "dist/index.module.d.ts" },
        { format: "cjs", file: "dist/index.d.cts" },
      ],
    },
    {
      input: "dist/dts/src/sw-entry.d.ts",
      output: [
        { format: "es", file: "dist/sw-entry.module.d.ts" },
        { format: "cjs", file: "dist/sw-entry.d.cts" },
      ],
    },
  ];

  for (const { input, output, external = [], plugins } of declarations) {
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

export default rollupEntries;
