import fs from "node:fs";
import path from "node:path";
import { watch } from "chokidar";
import { type Plugin, normalizePath } from "vite";

import type { SerwistViteContext } from "../lib/context.js";
import { generateServiceWorker } from "../lib/modules.js";
import { toFs } from "../lib/utils.js";

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
    async configureServer(server) {
      ctx.devEnvironment = true;

      await generateServiceWorker(ctx);

      const watcher = watch(path.dirname(ctx.options.injectManifest.swSrc), {
        ignoreInitial: true,
        ignored(str: string) {
          return str.startsWith(".");
        },
        followSymlinks: false,
      });

      watcher.on("change", async () => await generateServiceWorker(ctx));

      server.middlewares.use(async (req, res, next) => {
        if (!ctx.options.disable && req.url === ctx.options.swUrl) {
          res.setHeader("Content-Type", "application/javascript");
          if (ctx.options.devOptions.bundle) {
            if (!fs.existsSync(ctx.options.injectManifest.swDest)) {
              await generateServiceWorker(ctx);
            }
            const content = fs.readFileSync(ctx.options.injectManifest.swDest, "utf-8");
            res.write(content);
          } else {
            res.write(`import "${toFs(path.resolve(ctx.options.injectManifest.swSrc))}";`);
          }
          res.end();
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
          const content = fs.readFileSync(ctx.options.injectManifest.swDest, "utf-8");
          fs.rmSync(ctx.options.injectManifest.swDest);
          return content;
        }
      }
      return undefined;
    },
  };
};
