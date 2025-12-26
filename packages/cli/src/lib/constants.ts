/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import type { BuildOptions } from "esbuild";

export const constants = {
  defaultConfigFile: "serwist.config.js",
  ignoredDirectories: ["node_modules"],
  ignoredFileExtensions: ["map"],
};

export const SUPPORTED_ESBUILD_OPTIONS = [
  // CommonOptions
  "sourcemap",
  "legalComments",
  "sourceRoot",
  "sourcesContent",
  "format",
  "globalName",
  "target",
  "supported",
  "define",
  "treeShaking",
  "minify",
  "mangleProps",
  "reserveProps",
  "mangleQuoted",
  "mangleCache",
  "drop",
  "dropLabels",
  "minifyWhitespace",
  "minifyIdentifiers",
  "minifySyntax",
  "lineLimit",
  "charset",
  "ignoreAnnotations",
  "jsx",
  "jsxFactory",
  "jsxFragment",
  "jsxImportSource",
  "jsxDev",
  "jsxSideEffects",
  "pure",
  "keepNames",
  "absPaths",
  "color",
  "logLevel",
  "logLimit",
  "logOverride",
  "tsconfigRaw",
  // BuildOptions
  "bundle",
  "splitting",
  "preserveSymlinks",
  "external",
  "packages",
  "alias",
  "loader",
  "resolveExtensions",
  "mainFields",
  "conditions",
  "allowOverwrite",
  "tsconfig",
  "outExtension",
  "publicPath",
  "inject",
  "banner",
  "footer",
  "plugins",
] as const satisfies readonly (keyof BuildOptions)[];
