/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace, { type Replacement } from "@rollup/plugin-replace";
import swc from "@rollup/plugin-swc";
import fse from "fs-extra";
import type { RollupOptions } from "rollup";
import { rollup } from "rollup";
import upath from "upath";

import type { GeneratePartial, RequiredSWDestPartial } from "../types.js";
import { defaultSwcRc } from "./.swcrc.js";

interface NameAndContents {
  contents: string | Uint8Array;
  name: string;
}

export async function bundle({
  // babelPresetEnvTargets,
  mode,
  sourcemap,
  swDest,
  unbundledCode,
  replaceValues,
}: Omit<GeneratePartial, "runtimeCaching"> &
  RequiredSWDestPartial & {
    unbundledCode: string;
    replaceValues?: Record<string, Replacement>;
  }): Promise<Array<NameAndContents>> {
  // We need to write this to the "real" file system, as Rollup won't read from
  // a custom file system.
  const { dir, name } = upath.parse(swDest);

  const temporaryFile = (await import("tempy")).temporaryFile;

  const tempFile = temporaryFile({ name: `${name}.ts` });

  await fse.writeFile(tempFile, unbundledCode);

  const swcRc = defaultSwcRc;

  const rollupConfig = {
    plugins: [
      (commonjs as unknown as typeof commonjs.default)(),
      nodeResolve({
        extensions: [".mjs", ".js", ".json", ".node", ".cjs"],
      }),
      (replace as unknown as typeof replace.default)({
        // See https://github.com/GoogleChrome/workbox/issues/2769
        preventAssignment: true,
        delimiters: ['\\b', ''],
        "process.env.NODE_ENV": JSON.stringify(mode),
        ...replaceValues,
      }),
      (swc as unknown as typeof swc.default)({
        swc: {
          ...swcRc,
          minify: mode === "production",
        },
      }),
    ],
    input: unbundledCode,
  } satisfies RollupOptions;

  const bundle = await rollup(rollupConfig);

  const { output } = await bundle.generate({
    sourcemap,
    format: "es",
  });

  const files: NameAndContents[] = [];
  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === "asset") {
      files.push({
        name: chunkOrAsset.fileName,
        contents: chunkOrAsset.source,
      });
    } else {
      let code = chunkOrAsset.code;

      if (chunkOrAsset.map) {
        const sourceMapFile = chunkOrAsset.fileName + ".map";
        code += `//# sourceMappingURL=${sourceMapFile}\n`;

        files.push({
          name: sourceMapFile,
          contents: chunkOrAsset.map.toString(),
        });
      }

      files.push({
        name: chunkOrAsset.fileName,
        contents: code,
      });
    }
  }

  // Make sure that if there was a directory portion included in swDest, it's
  // preprended to all of the generated files.
  return files.map((file) => {
    file.name = upath.format({
      dir,
      base: file.name,
      ext: "",
      name: "",
      root: "",
    });
    return file;
  });
}
