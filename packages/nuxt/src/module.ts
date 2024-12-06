import path from "node:path";
import { addPlugin, createResolver, defineNuxtModule, extendWebpackConfig } from "@nuxt/kit";
import type { SerwistViteApi, SerwistViteContext } from "@serwist/vite";
import { createApi, createContext, dev as devPlugin, main as mainPlugin, resolveEntry } from "@serwist/vite";
import { version } from "../package.json";
import type { Require } from "./utils.js";
import { configurePwaOptions } from "./config.js";
import type { ClientOptions, ModuleOptions } from "./types.js";

export * from "./types.js";

export default defineNuxtModule<ModuleOptions>({
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

    let ctx: SerwistViteContext | undefined;
    let api: SerwistViteApi | undefined;

    const { client: _client, ...userOptions } = options as Require<ModuleOptions, "swUrl" | "swSrc" | "swDest" | "globDirectory" | "injectionPoint">;

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
      references.push({ path: resolver.resolve(runtimeDir, "plugins/augmentation.d.ts") });
    });

    nuxt.hook("nitro:init", (nitro) => {
      configurePwaOptions(options, nuxt, nitro.options);
    });

    nuxt.hook("vite:extend", ({ config }) => {
      const plugin = config.plugins?.find((p) => p && typeof p === "object" && "name" in p && p.name === "@serwist/vite");
      if (plugin) {
        throw new Error("Remove '@serwist/vite' from your Vite configuration! Do not use it alongside '@serwist/nuxt'.");
      }
    });

    nuxt.hook("vite:extendConfig", async (viteInlineConfig, { isClient }) => {
      if (!viteInlineConfig.plugins) {
        viteInlineConfig.plugins = [];
      }
      const plugin = viteInlineConfig.plugins.find((p) => p && typeof p === "object" && "name" in p && p.name === "@serwist/vite");
      if (plugin) {
        throw new Error("Remove '@serwist/vite' from your Vite configuration! Do not use it alongside '@serwist/nuxt'.");
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

      ctx = createContext(userOptions, "nuxt");
      api = createApi(ctx);
      const plugins = [mainPlugin(ctx, api), devPlugin(ctx, api)];
      viteInlineConfig.plugins.push(plugins);
    });

    extendWebpackConfig(() => {
      throw new Error("Webpack is not supported: '@serwist/nuxt' can only be used with Vite!");
    });

    if (!nuxt.options.dev) {
      nuxt.hook("nitro:build:public-assets", () => {
        if (!api || api.disabled) {
          return;
        }
        void api.generateSW();
      });
    }
  },
});
