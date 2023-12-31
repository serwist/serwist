import path from "node:path";

import { addPlugin, createResolver, defineNuxtModule, extendWebpackConfig } from "@nuxt/kit";
import type { SerwistViteApi, SerwistViteContext } from "@serwist/vite";
import { createApi, createContext, dev, main, resolveEntry } from "@serwist/vite";

import { version } from "../package.json";
import { configurePwaOptions } from "./config.js";
import type { ClientOptions, ModuleOptions } from "./types.js";
import type { RequiredFields } from "./utils-types.js";

export * from "./types.js";

export default defineNuxtModule<RequiredFields<ModuleOptions, "swUrl" | "swSrc" | "swDest" | "globDirectory" | "injectionPoint">>({
  meta: {
    name: "@serwist/nuxt",
    configKey: "serwist",
    compatibility: {
      nuxt: "^3.8.0",
      bridge: false,
    },
    version,
  },
  defaults(nuxt) {
    const publicDir = nuxt.options.nitro?.output?.publicDir
      ? path.resolve(nuxt.options.nitro.output.publicDir)
      : path.resolve(nuxt.options.buildDir, "../.output/public");
    return {
      base: nuxt.options.app.baseURL,
      scope: nuxt.options.app.baseURL,
      injectRegister: false,
      client: {
        registerPlugin: true,
      },
      // Try to find `service-worker.{ts,js}` or `service-worker/index.{ts,js}`. If not found,
      // force the user to provide a `swSrc` themself.
      swSrc: resolveEntry(path.resolve(nuxt.options.rootDir, "service-worker")) || undefined!,
      swDest: path.resolve(publicDir, "sw.js"),
      swUrl: "/sw.js",
      globDirectory: publicDir,
      injectionPoint: "self.__SW_MANIFEST",
    };
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    let ctx: SerwistViteContext | undefined, api: SerwistViteApi | undefined;

    const { manifest: manifestPath, client: _client, ...userOptions } = options;

    const client = { registerPlugin: true, ..._client } satisfies ClientOptions;

    const runtimeDir = resolver.resolve("./runtime");

    if (!nuxt.options.ssr) nuxt.options.build.transpile.push(runtimeDir);

    if (client.registerPlugin) {
      addPlugin({
        src: resolver.resolve(runtimeDir, "plugins/client"),
        mode: "client",
      });
    }

    nuxt.hook("prepare:types", ({ references }) => {
      references.push({ path: resolver.resolve(runtimeDir, "plugins/augmentation") });
    });

    nuxt.hook("nitro:init", (nitro) => {
      configurePwaOptions(options, nuxt, nitro.options);
    });

    nuxt.hook("vite:extend", ({ config }) => {
      const plugin = config.plugins?.find((p) => p && typeof p === "object" && "name" in p && p.name === "@serwist/vite");
      if (plugin) {
        throw new Error("Remove @serwist/vite from your Vite configuration! Do not use it alongside @serwist/nuxt.");
      }
    });

    nuxt.hook("vite:extendConfig", async (viteInlineConfig, { isClient }) => {
      if (!viteInlineConfig.plugins) {
        viteInlineConfig.plugins = [];
      }
      const plugin = viteInlineConfig.plugins.find((p) => p && typeof p === "object" && "name" in p && p.name === "@serwist/vite");
      if (plugin) {
        throw new Error("Remove @serwist/vite from your Vite conoptionsfiguration! Do not use it alongside @serwist/nuxt.");
      }

      if (isClient) {
        const configuration = "virtual:serwist-nuxt-configuration";
        const resolvedConfiguration = `\0${configuration}`;
        viteInlineConfig.plugins.push({
          name: "@serwist/nuxt:configuration",
          enforce: "pre",
          resolveId(id) {
            if (id === configuration) {
              return resolvedConfiguration;
            }
            return undefined;
          },
          async load(id) {
            if (id === resolvedConfiguration) {
              return `export const enabled = ${client.registerPlugin};`;
            }

            return undefined;
          },
        });
      }

      ctx = createContext(userOptions);
      api = createApi(ctx);

      const plugins = [main(ctx, api), dev(ctx, api)];
      viteInlineConfig.plugins.push(plugins);
    });

    extendWebpackConfig(() => {
      throw new Error("Webpack is not supported: @serwist/nuxt can only be used with Vite!");
    });

    // TODO: handle dev
    nuxt.hook("nitro:build:public-assets", async () => {
      if (!api || api.disabled) {
        return;
      }
      await api.generateSW();
    });
  },
});

declare module "@nuxt/schema" {
  interface NuxtConfig {
    ["serwist"]?: ModuleOptions;
  }
  interface NuxtOptions {
    ["serwist"]?: ModuleOptions;
  }
}
