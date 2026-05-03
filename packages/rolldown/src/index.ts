import { getFileManifestEntries, validateGetManifestOptions, type InjectManifestOptions } from "@serwist/build";
import path from "node:path";
import { build, type NormalizedInputOptions, type OutputOptions, type Plugin } from "rolldown";
import { postprocessPlugin } from "./lib/postprocess.js";
import { addChunkFilter, normalizeInput } from "./lib/utils.js";

export interface PluginOptions extends InjectManifestOptions {
  outputFormat?: OutputOptions["format"];
}

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
      const { swSrc, swDest, outputFormat, ...opts } = options;
      const getManifest = await getFileManifestEntries(await validateGetManifestOptions(opts));
      const serwistRolldown = await build({
        cwd: inputOptions?.cwd,
        platform: inputOptions?.platform,
        shimMissingExports: inputOptions?.shimMissingExports,
        input: {
          [swDestWithoutExtension]: swSrc,
        },
        transform: {
          define: {
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production"),
            "self.__SW_MANIFEST": JSON.stringify(getManifest.manifestEntries),
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
