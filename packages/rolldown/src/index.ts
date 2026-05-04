import { injectManifest } from "@serwist/build";
import { cyan, yellow } from "kolorist";
import path from "node:path";
import type { Plugin } from "rolldown";
import { buildPlugin } from "./lib/build.js";
import type { PluginOptions } from "./types.js";

export const serwist = (options: PluginOptions): Plugin => {
  return {
    name: "rolldown-plugin-serwist",
    ...buildPlugin(options),
    async writeBundle(outputOptions) {
      const { swSrc, swDest, outputFormat, ...opts } = options;
      const dest = path.join(outputOptions.dir ?? "", swDest);
      const { count, size, warnings } = await injectManifest({ swSrc: dest, swDest: dest, ...opts });
      this.info(`The service worker will precache ${cyan(count)} URLs, totaling ${cyan((size / 1024).toFixed(2))} KiB.`);
      for (const warning of warnings) {
        this.warn(yellow(warning));
      }
    },
  };
};
