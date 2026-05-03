import type { InjectManifestOptions } from "@serwist/build";
import path from "node:path";
import { build, RolldownMagicString, type NormalizedInputOptions, type OutputOptions, type Plugin } from "rolldown";
import { parseSync } from "rolldown/utils";
import { normalizeInput } from "./lib/utils.js";

export interface PluginOptions extends InjectManifestOptions {
  outputFormat?: OutputOptions["format"];
}

const addChunkFilter = (options: OutputOptions) => {
  options.codeSplitting =
    options.codeSplitting === false
      ? false
      : {
          groups: [
            ...(options.codeSplitting === true ? [] : (options.codeSplitting?.groups ?? [])),
            {
              name: "serwist",
              test: /node_modules[\\/](serwist|vite-plugin-serwist|rollup-plugin-serwist|@serwist\/)/,
            },
          ],
        };
};

const postprocessPlugin: Plugin = {
  name: "rolldown-plugin-serwist:postprocess",
  outputOptions(opts) {
    addChunkFilter(opts);
  },
  renderChunk: {
    filter: {
      code: { include: [/import/, /export/] },
    },
    async handler(code, chunk) {
      let hoisted = "";
      const imported = new Set<string>();
      const magicFile = new RolldownMagicString(code);
      const chunkDirectory = path.dirname(chunk.fileName);

      const ast = parseSync(chunk.name, code);
      const staticImports = ast.module.staticImports;
      const dynamicImports = ast.module.dynamicImports.map((im) => ({
        ...im,
        moduleRequest: {
          ...im.moduleRequest,
          value: magicFile.slice(im.moduleRequest.start + 1, im.moduleRequest.end - 1),
        },
      }));
      const staticExports = ast.module.staticExports;

      for (const importGroup of staticImports) {
        const importUri = importGroup.moduleRequest.value;
        if (importUri.startsWith(".")) {
          let importHeader = "";
          const importChunkName = path.join(chunkDirectory, importUri);
          if (!imported.has(importUri)) {
            imported.add(importUri);
            importHeader = `importScripts("./${importChunkName}");`;
          }
          const importEntries = importGroup.entries
            .map((im) =>
              im.importName.name === im.localName.value ? im.localName.value : `${im.importName.name ?? "default"}: ${im.localName.value}`,
            )
            .join(",");
          magicFile.update(importGroup.start, importGroup.end, `${importHeader}const { ${importEntries} } = globalThis["${importChunkName}"];`);
        } else {
          hoisted += magicFile.slice(importGroup.start, importGroup.end);
          magicFile.remove(importGroup.start, importGroup.end);
        }
      }

      for (const importExpression of dynamicImports) {
        const importUri = importExpression.moduleRequest.value;
        if (importUri.startsWith(".")) {
          let importHeader = "";
          const importChunkName = path.join(chunkDirectory, importUri);
          if (!imported.has(importUri)) {
            imported.add(importUri);
            importHeader = `importScripts("./${importChunkName}");`;
          }
          magicFile.update(importExpression.start, importExpression.end, `${importHeader}Promise.resolve(globalThis["${importChunkName}"])`);
        }
      }

      for (const exportGroup of staticExports) {
        magicFile.update(
          exportGroup.start,
          exportGroup.end,
          `globalThis["${chunk.fileName}"] = {${exportGroup.entries.map((e) => `${e.exportName.name}: ${e.localName.name}`).join(",")}};`,
        );
      }

      magicFile.prepend(`${hoisted}\n(function(){`);
      magicFile.append(`\n})();`);

      return magicFile;
    },
  },
};

export const serwist = (options?: PluginOptions): Plugin => {
  if (!options?.swSrc || !options?.swDest) {
    throw new Error("rolldown-plugin-serwist requires both swSrc and swDest.");
  }

  const swSrc = options.swSrc;
  const swDest = options.swDest;

  options.outputFormat = options.outputFormat ?? "iife";

  const esm = options?.outputFormat === "es" || options?.outputFormat === "esm" || options?.outputFormat === "module";
  let outputOptions: OutputOptions | null = null;
  let inputOptions: NormalizedInputOptions | null = null;

  if (esm) {
    return {
      name: "rolldown-plugin-serwist:esm",
      options(opts) {
        opts.input = {
          [path.parse(swDest).name]: swSrc,
          ...normalizeInput(opts.input),
        };
      },
      outputOptions(opts) {
        addChunkFilter(opts);
      },
    };
  }

  return {
    name: "rolldown-plugin-serwist",
    buildStart(options) {
      inputOptions = options;
    },
    outputOptions(options) {
      outputOptions = options;
    },
    async generateBundle(_, bundle) {
      const serwistRolldown = await build({
        cwd: inputOptions?.cwd,
        platform: inputOptions?.platform,
        shimMissingExports: inputOptions?.shimMissingExports,
        input: {
          [path.parse(swDest).name]: swSrc,
        },
        write: false,
        plugins: [
          postprocessPlugin,
          ...(inputOptions?.plugins.filter((plugin) => !("name" in plugin) || plugin.name !== "rolldown-plugin-serwist") ?? []),
        ],
        output: {
          ...outputOptions,
          dir: path.dirname(swDest),
          file: undefined,
          format: "es",
          entryFileNames: "[name].js",
          chunkFileNames: !outputOptions?.chunkFileNames
            ? "serwist/[name]-[hash].js"
            : typeof outputOptions.chunkFileNames === "string"
              ? path.join(path.dirname(outputOptions.chunkFileNames), "serwist/[name]-[hash].js")
              : outputOptions.chunkFileNames,
        },
      });
      for (const chunk of serwistRolldown.output) {
        if (bundle[chunk.fileName]) continue;
        if (chunk.type === "chunk") {
          this.emitFile({
            type: "prebuilt-chunk",
            fileName: chunk.fileName,
            code: chunk.code,
          });
        } else {
          this.emitFile({
            type: "asset",
            fileName: chunk.fileName,
            source: chunk.source,
          });
        }
      }
    },
  };
};
