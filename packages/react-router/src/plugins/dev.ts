import fs from "node:fs";
import { watch } from "chokidar";
import type { Plugin } from "vite";
import { generateServiceWorker } from "vite-plugin-serwist";

import type { SerwistReactRouterContext } from "../lib/context.js";

/**
 * Internal dev plugin used by `@serwist/react-router`.
 * @internal
 * @param ctx
 * @param api
 * @returns
 */
export const devPlugin = (ctx: SerwistReactRouterContext): Plugin => {
  return <Plugin>{
    name: "@serwist/react-router:dev",
    async configureServer(server) {
      if (!ctx.isReactRouterDevServer) return;

      ctx.devEnvironment = true;

      await generateServiceWorker(ctx);

      const watcher = watch([ctx.reactRouterPluginContext.reactRouterConfig.appDirectory, ctx.options.injectManifest.swSrc], {
        ignoreInitial: true,
        ignored(str: string) {
          return str.startsWith(".");
        },
        followSymlinks: false,
      });

      watcher.on("change", async () => await generateServiceWorker(ctx));

      server.middlewares.use(async (req, res, next) => {
        if (!ctx.options.disable && req.url === ctx.options.swUrl) {
          const content = fs.readFileSync(ctx.options.injectManifest.swDest, "utf-8");
          res.setHeader("Content-Type", "application/javascript");
          res.write(content);
          res.end();
        } else {
          next();
        }
      });
    },
  };
};
