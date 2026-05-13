import { injectManifest } from "@serwist/build";
import { cyan, yellow } from "kolorist";
import type { Plugin } from "vite";
import type { PluginContext } from "../lib/context.js";

export const injectPlugin = (ctx: PluginContext): Plugin => ({
  name: "vite-plugin-serwist:inject",
  applyToEnvironment(env) {
    return env.name === "serwist";
  },
  async writeBundle() {
    const { count, size, warnings } = await injectManifest({ ...ctx.options.injectManifest, swSrc: ctx.options.injectManifest.swDest });
    this.info(`The service worker will precache ${cyan(count)} URLs, totaling ${cyan((size / 1024).toFixed(2))} KiB.`);
    for (const warning of warnings) {
      this.warn(yellow(warning));
    }
  },
});
