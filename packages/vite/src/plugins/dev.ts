import fs from "node:fs/promises";
import path from "node:path";

import { type Plugin, normalizePath } from "vite";

import type { SerwistViteContext } from "../lib/context.js";
import { toFs } from "../lib/utils.js";
import { generateServiceWorker } from "../lib/modules.js";

// This plugin handles the service worker in two ways:
// - If `devOptions.bundle` is enabled, hook a middleware that intercepts service worker requests
// and returns the result of `generateServiceWorker(ctx)`.
// - Otherwise, run `injectManifest` and return the service worker through `async load(id)`. Although
// `precacheEntries` is always `undefined`, we still do this to check the user's `injectManifest` options
// in dev mode.
/**
 * Internal dev plugin used by `vite-plugin-serwist`.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const devPlugin = (ctx: SerwistViteContext): Plugin => {
  return {
    name: "vite-plugin-serwist:dev",
    apply: "serve",
    configureServer(server) {
      ctx.devEnvironment = true;
      server.middlewares.use(async (req, res, next) => {
        if (!ctx.options.disable && req.url === ctx.options.swUrl) {
          if (ctx.options.devOptions.bundle) {
            await generateServiceWorker(ctx);
            const content = await fs.readFile(ctx.options.injectManifest.swDest, "utf-8");
            await fs.rm(ctx.options.injectManifest.swDest);
            res.setHeader("Content-Type", "application/javascript");
            res.write(content);
            res.end();
          } else {
            res.setHeader("Content-Type", "application/javascript");
            res.write(`import "${toFs(path.resolve(ctx.options.injectManifest.swSrc))}";`);
            res.end();
          }
        } else {
          next();
        }
      });
    },
    async load(id) {
      if (!ctx.options.disable && !ctx.options.devOptions.bundle) {
        const swSrcId = normalizePath(ctx.options.injectManifest.swSrc);
        if (id === swSrcId) {
          await generateServiceWorker(ctx);
          const content = await fs.readFile(ctx.options.injectManifest.swDest, "utf-8");
          await fs.rm(ctx.options.injectManifest.swDest);
          return content;
        }
      }
      return undefined;
    },
  };
};
