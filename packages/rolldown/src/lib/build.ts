import path from "node:path";
import { build, type NormalizedInputOptions, type OutputOptions, type Plugin } from "rolldown";
import type { PluginOptions } from "../types.js";
import { postprocessPlugin } from "./postprocess.js";
import { addChunkFilter, normalizeInput } from "./utils.js";

/**
 * Creates a Rolldown plugin that adds the service worker source file as an
 * entry point to the Rolldown build and post-processes the generated chunks
 * to ensure they are correctly imported.
 *
 * @param options
 * @returns
 */
export const buildPlugin = (options: PluginOptions): Partial<Plugin> => {
  const swDest = path.parse(options.swDest);
  const swDestDirectory = swDest.dir;
  const swDestWithoutExtension = path.join(swDestDirectory, swDest.name);

  const outputFormat = options.outputFormat ?? "iife";

  if (outputFormat !== "iife") {
    return {
      options(opts) {
        opts.input = {
          [swDestWithoutExtension]: options.swSrc,
          ...normalizeInput(opts.input),
        };
      },
      outputOptions(opts) {
        addChunkFilter(opts);
      },
    };
  }

  let outputOptions: OutputOptions | null = null;
  let inputOptions: NormalizedInputOptions | null = null;
  return {
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
          [swDestWithoutExtension]: options.swSrc,
        },
        transform: {
          define: {
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production"),
          },
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
