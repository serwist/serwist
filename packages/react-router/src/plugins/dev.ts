import fs from "node:fs";
import { watch } from "chokidar";
import type { Plugin } from "vite";
import { generateServiceWorker } from "vite-plugin-serwist";

import type { SerwistReactRouterContext } from "../lib/context.js";

export const devPlugin = (ctx: SerwistReactRouterContext): Plugin => {
  return <Plugin>{
    name: "@serwist/react-router:dev",
    async configureServer(server) {
      if (!ctx.isReactRouterDevServer) return;

      ctx.viteContext.devEnvironment = true;

      await generateServiceWorker(ctx.viteContext);

      const watcher = watch([ctx.reactRouterPluginContext.reactRouterConfig.appDirectory, ctx.viteContext.options.injectManifest.swSrc], {
        ignoreInitial: true,
        ignored(str: string) {
          return str.startsWith(".");
        },
        followSymlinks: false,
      });

      watcher.on("change", async () => await generateServiceWorker(ctx.viteContext));

      server.middlewares.use(async (req, res, next) => {
        if (!ctx.viteContext.options.disable && req.url === ctx.viteContext.options.swUrl) {
          const content = fs.readFileSync(ctx.viteContext.options.injectManifest.swDest, "utf-8");
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
