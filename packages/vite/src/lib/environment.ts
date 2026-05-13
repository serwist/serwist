import path from "node:path";
import type { OutputOptions } from "rolldown";
import type { EnvironmentOptions, ResolvedConfig } from "vite";
import type { Framework } from "./context.js";
import type { PluginOptionsComplete } from "./types.js";

const transformOutputOptions = (output: OutputOptions | undefined): OutputOptions => ({
  ...output,
  format: "es",
  entryFileNames: "[name].js",
  chunkFileNames: !output?.chunkFileNames
    ? "serwist/[name]-[hash].js"
    : typeof output.chunkFileNames === "string"
      ? path.join(path.dirname(output.chunkFileNames), "serwist/[name]-[hash].js")
      : output.chunkFileNames,
});

export const getEnvironmentOptions = async (
  options: PluginOptionsComplete,
  framework: Framework | undefined,
  viteConfig: ResolvedConfig,
): Promise<EnvironmentOptions> => {
  const swDest = path.parse(options.injectManifest.swDest);

  await options.integration?.beforeBuildServiceWorker?.(options);

  const define: Record<string, any> = {
    // Nuxt is weird: during the build, it manually defines browser APIs, such as `window`,
    // `document`, `location`,..., as `undefined`. `define` doesn't seem to have anything
    // particularly useful for the service worker as well, so we don't extend it.
    ...(framework === "nuxt" ? undefined : viteConfig.define),
  };

  const outputOptions = viteConfig.build.rolldownOptions.output;

  return {
    define,
    build: {
      rolldownOptions: {
        ...options.rolldownOptions,
        input: { [swDest.name]: options.injectManifest.swSrc },
        output: Array.isArray(outputOptions) ? outputOptions.map(transformOutputOptions) : transformOutputOptions(outputOptions),
      },
      outDir: swDest.dir,
      emptyOutDir: false,
    },
  };
};
