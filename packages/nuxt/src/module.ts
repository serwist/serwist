import path from "node:path";
import { addPlugin, createResolver, defineNuxtModule, extendWebpackConfig } from "@nuxt/kit";
import type { SerwistViteContext } from "vite-plugin-serwist";
import { createContext, dev as devPlugin, generateServiceWorker, main as mainPlugin, resolveEntry } from "vite-plugin-serwist";
import packageJson from "../package.json" with { type: "json" };
import { configureSerwistOptions } from "./config.js";
import type { ClientOptions, DefaultModuleOptions, ModuleOptions } from "./types.js";

export * from "./types.js";

export default defineNuxtModule<ModuleOptions>().with<DefaultModuleOptions>({
  meta: {
    name: "@serwist/nuxt",
    configKey: "serwist",
    compatibility: {
      nuxt: "^3.8.0 || ^4.0.0",
    },
    version: packageJson.version,
  },
  defaults(nuxt) {
    return {
      base: nuxt.options.app.baseURL,
      scope: nuxt.options.app.baseURL,
      client: {
        registerPlugin: true,
      },
      // Try to find `service-worker.{ts,js}` or `service-worker/index.{ts,js}`. If not found,
      // force the user to provide a `swSrc` themself.
      swSrc: resolveEntry(path.resolve(nuxt.options.rootDir, "service-worker")) || undefined!,
      // If `swDest` is not set by `configureSerwistOptions`, something is wrong.
      swDest: "",
      swUrl: "/sw.js",
      // If `globDirectory` is not set by `configureSerwistOptions`, something is wrong.
      globDirectory: "",
      injectionPoint: "self.__SW_MANIFEST",
    };
  },
  async setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

    let ctx: SerwistViteContext | undefined;

    const { client: _client, ...options } = _options;

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
      configureSerwistOptions(options, nuxt, nitro.options);
    });

    nuxt.hook("vite:extend", ({ config }) => {
      const plugin = config.plugins?.find((p) => p && typeof p === "object" && "name" in p && p.name === "vite-plugin-serwist");
      if (plugin) {
        throw new Error("Remove 'vite-plugin-serwist' from your Vite configuration! Do not use it alongside '@serwist/nuxt'.");
      }
    });

    nuxt.hook("vite:extendConfig", async (viteInlineConfig, { isClient }) => {
      if (!viteInlineConfig.plugins) viteInlineConfig.plugins = [];

      const plugin = viteInlineConfig.plugins.find((p) => p && typeof p === "object" && "name" in p && p.name === "vite-plugin-serwist");

      if (plugin) throw new Error("Remove 'vite-plugin-serwist' from your Vite configuration! Do not use it alongside '@serwist/nuxt'.");

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

      ctx = createContext(options, "nuxt");
      viteInlineConfig.plugins.push(mainPlugin(ctx), devPlugin(ctx));
    });

    extendWebpackConfig(() => {
      throw new Error("Webpack is not supported: '@serwist/nuxt' can only be used with Vite!");
    });

    if (!nuxt.options.dev) {
      nuxt.hook("nitro:build:public-assets", () => {
        if (ctx && !ctx.options.disable) void generateServiceWorker(ctx);
      });
    }
  },
});
