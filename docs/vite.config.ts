import path from "node:path";
import type { PluginOptions, SerwistViteApi, SerwistViteContext } from "@serwist/vite";
import { createApi, createContext, main as mainPlugin } from "@serwist/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import config from "./svelte.config";

// We do not rely on `@serwist/vite`'s built-in `buildPlugin` because
// it runs during the client build, but SvelteKit builds the service worker
// during the server build, which takes place after the client one.
/**
 * Custom Serwist build plugin for your custom SvelteKit integration.
 * @param ctx
 * @param api
 * @returns
 */
const buildPlugin = (ctx: SerwistViteContext, api: SerwistViteApi) => {
  return <Plugin>{
    name: "@serwist/vite:build",
    apply: "build",
    enforce: "pre",
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        if (api && !api.disabled && ctx.viteConfig.build.ssr) {
          await api.generateSW();
        }
      },
    },
    buildEnd(error) {
      if (error) throw error;
    },
  };
};

// Here is the main logic: it stores your Serwist configuration, creates `@serwist/vite`'s
// context and API, and constructs the necessary Vite plugins.
const serwist = (): Plugin[] => {
  let buildAssetsDir = config.kit?.appDir ?? "_app/";
  if (buildAssetsDir[0] === "/") {
    buildAssetsDir = buildAssetsDir.slice(1);
  }
  if (buildAssetsDir[buildAssetsDir.length - 1] !== "/") {
    buildAssetsDir += "/";
  }
  // This part is your Serwist configuration.
  const options: PluginOptions = {
    // We will set these later in `configureOptions`.
    swSrc: null!,
    swDest: null!,
    swUrl: "/service-worker.js",
    // We will set this later in `configureOptions`.
    globDirectory: null!,
    globPatterns: [
      // Static assets.
      "client/**/*.{js,css,ico,png,svg,webp,json,webmanifest}",
      "prerendered/pages/**/*.html",
      "prerendered/dependencies/**/__data.json",
    ],
    globIgnores: ["server/*.*", "client/service-worker.js", "client/_redirects", "client/yoga.wasm", "client/noto-sans-mono.ttf"],
    injectionPoint: "self.__SW_MANIFEST",
    integration: {
      closeBundleOrder: "pre",
      // These options depend on `viteConfig`, so we have to use `@serwist/vite`'s configuration hook.
      configureOptions(viteConfig, options) {
        // Since we don't use `devPlugin`, the service worker is not bundled in development.
        const clientOutDir = path.resolve(viteConfig.root, viteConfig.build.outDir, "../client");

        // Kit fixes the service worker's name to 'service-worker.js'
        // This tells Serwist to replace `injectionPoint` with the precache manifest in the bundled service worker.
        options.swSrc = path.resolve(clientOutDir, "service-worker.js");
        options.swDest = path.resolve(clientOutDir, "service-worker.js");

        // `clientOutDir` is '.svelte-kit/output/client'. However, since we also want to precache prerendered
        // pages in the '.svelte-kit/output/prerendered' directory, we have to move one directory up.
        options.globDirectory = path.resolve(clientOutDir, "..");

        options.manifestTransforms = [
          // This `manifestTransform` makes the precache manifest valid.
          async (entries) => {
            const manifest = entries.map((e) => {
              // Static assets are in the ".svelte-kit/output/client" directory.
              // Prerender pages are in the ".svelte-kit/output/prerendered/pages" directory.
              // Remove the prefix, but keep the ending slash.
              if (e.url.startsWith("client/")) {
                e.url = e.url.slice(6);
              } else if (e.url.startsWith("prerendered/pages/")) {
                e.url = e.url.slice(17);
              } else if (e.url.startsWith("prerendered/dependencies/")) {
                e.url = e.url.slice(24);
              }

              if (e.url.endsWith(".html")) {
                // trailingSlash: 'always'
                // https://kit.svelte.dev/docs/page-options#trailingslash
                // "/abc/index.html" -> "/abc/"
                // "/index.html" -> "/"
                if (e.url.endsWith("/index.html")) {
                  e.url = e.url.slice(0, e.url.lastIndexOf("/") + 1);
                }
                // trailingSlash: 'ignored'
                // trailingSlash: 'never'
                // https://kit.svelte.dev/docs/page-options#trailingslash
                // "/xxx.html" -> "/xxx"
                else {
                  e.url = e.url.substring(0, e.url.lastIndexOf("."));
                }
              }

              // Finally, prepend `viteConfig.base`.
              // "/path" -> "/base/path"
              // "/" -> "/base/"
              e.url = path.posix.join(viteConfig.base, e.url);

              return e;
            });

            return { manifest };
          },
        ];
      },
    },
    // We don't want to version 'client/_app/immutable/**/*' files because they are
    // already versioned by Vite via their URLs.
    dontCacheBustURLsMatching: new RegExp(`^client/${buildAssetsDir}immutable/`),
  };
  const ctx = createContext(options, undefined);
  const api = createApi(ctx);
  return [mainPlugin(ctx, api), buildPlugin(ctx, api)];
};

export default defineConfig({
  plugins: [tailwindcss(), enhancedImages(), sveltekit(), serwist()],
});
