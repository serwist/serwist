import path from "node:path";
import type { Plugin } from "rolldown";
import { RolldownMagicString } from "rolldown";
import { parseSync } from "rolldown/utils";
import { addChunkFilter, createImporter } from "./utils.js";

/**
 * Postprocess plugin that transforms the generated service worker bundle to be compatible with
 * the `importScripts` mechanism. It hoists non-relative imports, transforms relative imports
 * into `importScripts` statements, and exports the chunk's exports to `globalThis` under their
 * chunk paths relative to the output directory.
 *
 * @param swDestDirectory The output directory of the service worker, used to resolve import
 * paths from the service worker's perspective.
 * @returns A Rolldown plugin that postprocesses the generated service worker bundle.
 */
export const postprocessPlugin = (swDestDirectory: string): Plugin => ({
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
          magicFile.update(
            importGroup.start,
            importGroup.end,
            `${importIfNotExists(importUri)}const { ${importGroup.entries
              .map((im) =>
                im.importName.name === im.localName.value ? im.localName.value : `${im.importName.name ?? "default"}: ${im.localName.value}`,
              )
              .join(",")} } = globalThis["${importChunkName}"];`,
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
