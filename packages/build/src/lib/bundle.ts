/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import swc from "@rollup/plugin-swc";
import { omt } from "@serwist/rollup-plugin-off-main-thread";
import fse from "fs-extra";
import type { RollupOptions } from "rollup";
import { rollup } from "rollup";
import { temporaryFile } from "tempy";
import upath from "upath";

import type { GeneratePartial, RequiredSWDestPartial } from "../types.js";
import { defaultSwcRc } from "./.swcrc.js";

interface NameAndContents {
  contents: string | Uint8Array;
  name: string;
}

export async function bundle({
  babelPresetEnvTargets,
  inlineWorkboxRuntime,
  mode,
  sourcemap,
  swDest,
  unbundledCode,
}: Omit<GeneratePartial, "runtimeCaching"> &
  RequiredSWDestPartial & { unbundledCode: string }): Promise<
  Array<NameAndContents>
> {
  // We need to write this to the "real" file system, as Rollup won't read from
  // a custom file system.
  const { dir, base } = upath.parse(swDest);

  const tempFile = temporaryFile({ name: base });
  await fse.writeFile(tempFile, unbundledCode);

  const swcRc = defaultSwcRc;

  if (!swcRc.env) {
    swcRc.env = {};
  }
  swcRc.env.targets = babelPresetEnvTargets;

  const rollupConfig = {
    plugins: [
      nodeResolve(),
      (replace as unknown as typeof replace.default)({
        // See https://github.com/GoogleChrome/workbox/issues/2769
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      (swc as unknown as typeof swc.default)({
        swc: {
          ...swcRc,
          minify: mode === "production",
        },
      }),
    ],
    input: tempFile,
  } satisfies RollupOptions;

  // Rollup will inline the runtime by default. If we don't want that, we need
  // to add in some additional config.
  if (!inlineWorkboxRuntime) {
    rollupConfig.plugins.unshift(omt());
  }

  const bundle = await rollup(rollupConfig);

  const { output } = await bundle.generate({
    sourcemap,
    // Using an external Workbox runtime requires 'amd'.
    format: inlineWorkboxRuntime ? "es" : "amd",
    ...(!inlineWorkboxRuntime && {
      manualChunks(id) {
        return id.includes("workbox") ? "workbox" : undefined;
      },
    }),
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
