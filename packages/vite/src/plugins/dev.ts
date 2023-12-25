import { existsSync, mkdirSync, promises as fs } from "node:fs";
import { resolve } from "node:path";

import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";

import { generateWebManifestFile } from "../assets.js";
import { DEV_READY_NAME, DEV_REGISTER_SW_NAME, DEV_SW_NAME, DEV_SW_VIRTUAL, FILE_SW_REGISTER, RESOLVED_DEV_SW_VIRTUAL } from "../constants.js";
import type { SerwistViteContext } from "../context.js";
import { generateRegisterDevSw, generateSimpleSwRegister, generateSwHmr, injectServiceWorker } from "../html.js";
import type { ResolvedPluginOptions } from "../types.js";
import { normalizePath } from "../utils.js";

export const swDevOptions = {
  swUrl: DEV_SW_NAME,
  swDevGenerated: false,
  workboxPaths: new Map<string, string>(),
};

export const devPlugin = (ctx: SerwistViteContext) => {
  const transformIndexHtmlHandler = (html: string) => {
    const { options } = ctx;
    if (options.disable || !options.manifest || !options.devOptions.enabled) return html;

    html = injectServiceWorker(html, options, true);

    return html.replace(
      "</body>",
      `${generateRegisterDevSw(options.base)}
</body>`
    );
  };

  return <Plugin>{
    name: "@serwist/vite:dev",
    apply: "serve",
    transformIndexHtml: {
      order: "post",
      async handler(html) {
        return transformIndexHtmlHandler(html);
      },
      enforce: "post", // deprecated since Vite 4
      async transform(html) {
        // deprecated since Vite 4
        return transformIndexHtmlHandler(html);
      },
    },
    configureServer(server) {
      ctx.devEnvironment = true;
      const { options } = ctx;
      if (!options.disable && options.manifest && options.devOptions.enabled) {
        server.ws.on(DEV_READY_NAME, createSWResponseHandler(server, ctx));
        const name = `${options.base}${options.manifestFilename}`;
        server.middlewares.use((req, res, next) => {
          if (req.url === name) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/manifest+json");
            res.write(generateWebManifestFile(options), "utf-8");
            res.end();
          } else {
            next();
          }
        });
      }
    },
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

const resolveDevDistFolder = async (options: ResolvedPluginOptions, viteConfig: ResolvedConfig) => {
  return options.devOptions.resolveTempFolder ? await options.devOptions.resolveTempFolder() : resolve(viteConfig.root, "dev-dist");
};

const createDevRegisterSW = async (options: ResolvedPluginOptions, viteConfig: ResolvedConfig) => {
  if (options.injectRegister === "script" || options.injectRegister === "script-defer") {
    const devDist = await resolveDevDistFolder(options, viteConfig);
    if (!existsSync(devDist)) mkdirSync(devDist);

    const registerSW = resolve(devDist, FILE_SW_REGISTER);
    if (existsSync(registerSW)) {
      // since we don't delete the dev-dist folder, we just add it if already exists
      if (!swDevOptions.workboxPaths.has(registerSW)) swDevOptions.workboxPaths.set(normalizePath(`${options.base}${FILE_SW_REGISTER}`), registerSW);

      return;
    }

    await fs.writeFile(registerSW, generateSimpleSwRegister(options, true), { encoding: "utf8" });
    swDevOptions.workboxPaths.set(normalizePath(`${options.base}${FILE_SW_REGISTER}`), registerSW);
  }
};

const createSWResponseHandler = (server: ViteDevServer, ctx: SerwistViteContext): (() => Promise<void>) => {
  return async () => {
    const { options, useImportRegister } = ctx;
    const { injectRegister, scope, base } = options;
    // don't send the sw registration if virtual imported or disabled
    if (!useImportRegister && injectRegister) {
      if (injectRegister === "auto") options.injectRegister = "script";

      await createDevRegisterSW(options, ctx.viteConfig);

      server.ws.send({
        type: "custom",
        event: DEV_REGISTER_SW_NAME,
        data: {
          mode: options.injectRegister,
          scope,
          inlinePath: `${base}${DEV_SW_NAME}`,
          registerPath: `${base}${FILE_SW_REGISTER}`,
          swType: options.devOptions.type,
        },
      });
    }
  };
};
