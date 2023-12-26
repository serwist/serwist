import { promises as fs } from "node:fs";

import type { Plugin } from "vite";

import { DEV_SW_NAME, DEV_SW_VIRTUAL, RESOLVED_DEV_SW_VIRTUAL } from "../constants.js";
import type { SerwistViteContext } from "../context.js";
import { generateSwHmr } from "../html.js";
import { normalizePath } from "../utils.js";

export const swDevOptions = {
  swUrl: DEV_SW_NAME,
  swDevGenerated: false,
  workboxPaths: new Map<string, string>(),
};

export const devPlugin = (ctx: SerwistViteContext) => {
  return <Plugin>{
    name: "@serwist/vite:dev",
    apply: "serve",
    resolveId(id) {
      if (id === DEV_SW_VIRTUAL) return RESOLVED_DEV_SW_VIRTUAL;

      const { options } = ctx;
      if (!options.disable && options.devOptions.enabled) {
        const name = id.startsWith("/") ? id.slice(1) : id;
        // the sw must be registered with .js extension on browser, here we detect that request:
        // - the .js file and source with .ts, or
        // - the .ts source file
        // in both cases we need to resolve the id to the source file to load it and add empty injection point on loadDev
        // we need to always return the path to source file name to resolve imports on the sw
        return name === swDevOptions.swUrl || name === options.injectManifest.swSrc ? options.injectManifest.swSrc : undefined;
      }

      return undefined;
    },
    async load(id) {
      if (id === RESOLVED_DEV_SW_VIRTUAL) return generateSwHmr();

      const { options } = ctx;
      if (!options.disable && options.devOptions.enabled) {
        // we need to inject self.__WB_MANIFEST with an empty array: there is no pwa on dev
        const swSrc = normalizePath(options.injectManifest.swSrc);
        if (id === swSrc) {
          let content = await fs.readFile(options.injectManifest.swSrc, "utf-8");
          const resolvedIP = options.injectManifest.injectionPoint;
          if (resolvedIP) {
            const ip = new RegExp(resolvedIP, "g");
            const navigateFallback = options.devOptions.navigateFallback;
            // we only add the navigateFallback if using registerRoute for offline support on custom sw
            if (navigateFallback) content = content.replace(ip, `[{ url: '${navigateFallback}' }]`);
            else content = content.replace(ip, "[]");
          }
          return content;
        }

        if (swDevOptions.workboxPaths.has(id)) return await fs.readFile(swDevOptions.workboxPaths.get(id)!, "utf-8");

        return undefined;
      }

      return undefined;
    },
  };
};
