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

/**
 * Creates an importer function that generates `importScripts` statements for the given
 * import URI if it hasn't been imported before. The import URI is resolved from the service
 * worker's perspective based on the provided base path.
 * 
 * @param importBase The base path to resolve import URIs against.
 * @returns A function that takes an import URI and returns an `importScripts` statement if
 * the URI hasn't been imported before, or an empty string if it has.
 */
const createImporter = (importBase: string) => {
  const imported = new Set<string>();
  return (importUri: string) => {
    const resolvedImportUri = path.join(importBase, importUri);
    if (!imported.has(resolvedImportUri)) {
      imported.add(resolvedImportUri);
      return `importScripts("${resolvedImportUri}");`;
    }
    return "";
  };
};

const postprocessPlugin = (swDestDirectory: string): Plugin => ({
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
      const magicFile = new RolldownMagicString(code);
      const chunkDirectory = path.dirname(chunk.fileName);
      // Resolve the import URI from the service worker's perspective due to how `importScripts` works.
      const importIfNotExists = createImporter(path.relative(swDestDirectory, chunkDirectory));

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
          // The imported bindings are grouped under their chunk paths relative to the output directory.
          const importChunkName = path.join(chunkDirectory, importUri);
          const importEntries = importGroup.entries
            .map((im) =>
              im.importName.name === im.localName.value ? im.localName.value : `${im.importName.name ?? "default"}: ${im.localName.value}`,
            )
            .join(",");
          magicFile.update(
            importGroup.start,
            importGroup.end,
            `${importIfNotExists(importUri)}const { ${importEntries} } = globalThis["${importChunkName}"];`,
          );
        } else {
          hoisted += magicFile.slice(importGroup.start, importGroup.end);
          magicFile.remove(importGroup.start, importGroup.end);
        }
      }

      for (const importExpression of dynamicImports) {
        const importUri = importExpression.moduleRequest.value;
        if (importUri.startsWith(".")) {
          // The imported bindings are grouped under their chunk paths relative to the output directory.
          const importChunkName = path.join(chunkDirectory, importUri);
          magicFile.update(
            importExpression.start,
            importExpression.end,
            `${importIfNotExists(importUri)}Promise.resolve(globalThis["${importChunkName}"])`,
          );
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
});

export const serwist = (options?: PluginOptions): Plugin => {
  if (!options?.swSrc || !options?.swDest) {
    throw new Error("rolldown-plugin-serwist requires both swSrc and swDest.");
  }

  const swSrc = options.swSrc;
  const swDest = path.parse(options.swDest);
  const swDestDirectory = swDest.dir;
  const swDestWithoutExtension = path.join(swDestDirectory, swDest.name);

  options.outputFormat = options.outputFormat ?? "iife";

  const esm = options?.outputFormat === "es" || options?.outputFormat === "esm" || options?.outputFormat === "module";
  let outputOptions: OutputOptions | null = null;
  let inputOptions: NormalizedInputOptions | null = null;

  if (esm) {
    return {
      name: "rolldown-plugin-serwist:esm",
      options(opts) {
        opts.input = {
          [swDestWithoutExtension]: swSrc,
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
          [swDestWithoutExtension]: swSrc,
        },
        write: false,
        plugins: [
          postprocessPlugin(swDestDirectory),
          ...(inputOptions?.plugins.filter((plugin) => !("name" in plugin) || plugin.name !== "rolldown-plugin-serwist") ?? []),
        ],
        output: {
          ...outputOptions,
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
