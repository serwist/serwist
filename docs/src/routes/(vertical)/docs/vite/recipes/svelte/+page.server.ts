import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "SvelteKit - Recipes - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "SvelteKit",
    desc: "Recipes - @serwist/vite",
  }),
  toc: [
    {
      title: "SvelteKit",
      id: "recipe-svelte",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        { title: "Install", id: "install" },
        {
          title: "Implementation",
          id: "implementation",
          children: [
            {
              title: "Step 1: Update tsconfig.json",
              id: "updating-tsconfig",
            },
            {
              title: "Step 2: Update .gitignore",
              id: "updating-gitignore",
            },
            {
              title: "Step 3: Configure SvelteKit",
              id: "configuring-svelte",
            },
            {
              title: "Step 4: Configure Vite",
              id: "configuring-vite",
            },
            {
              title: "Step 5: Write a service worker",
              id: "writing-a-sw",
            },
            {
              title: "Step 6: Add a web application manifest",
              id: "adding-webmanifest",
            },
            {
              title: "Step 7: Register the service worker and add metadata to <head />",
              id: "updating-layout",
            },
          ],
        },
      ],
    },
  ],
  code: {
    install: highlightCode(
      locals.highlighter,
      {
        npm: {
          code: "npm i -D @serwist/build @serwist/vite @serwist/window serwist",
          lang: "bash",
        },
        yarn: {
          code: "yarn add -D @serwist/build @serwist/vite @serwist/window serwist",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm add -D @serwist/build @serwist/vite @serwist/window serwist",
          lang: "bash",
        },
        bun: {
          code: "bun add -D @serwist/build @serwist/vite serwist",
          lang: "bash",
        },
      },
      { idPrefix: "installing-serwist-vite" },
    ),
    tsConfig: highlightCode(
      locals.highlighter,
      {
        "tsconfig.json": {
          code: `{
  // Other stuff...
  "compilerOptions": {
    // Other options...
    "types": [
      // Other types...
      // This allows Serwist to correctly type "virtual:serwist".
      "@serwist/vite/typings"
    ],
  },
}`,
          lang: "json",
        },
      },
      { idPrefix: "updating-tsconfig" },
    ),
    gitignore: highlightCode(
      locals.highlighter,
      {
        ".gitignore": {
          code: `# Serwist
public/sw*
public/swe-worker*`,
          lang: "sh",
        },
      },
      { idPrefix: "updating-tsconfig" },
    ),
    svelteConfig: highlightCode(
      locals.highlighter,
      {
        "svelte.config.js": {
          code: `/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Other options...
  kit: {
    serviceWorker: {
      register: false,
    },
  },
};

export default config;`,
          lang: "javascript",
        },
      },
      { idPrefix: "configuring-svelte", useTwoslash: false },
    ),
    viteConfig: highlightCode(
      locals.highlighter,
      {
        "vite.config.ts": {
          code: `import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { errors } from "@serwist/build";
import { createApi, createContext, dev as devPlugin, main as mainPlugin } from "@serwist/vite";
import type { PluginOptions, SerwistViteApi, SerwistViteContext } from "@serwist/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import config from "./svelte.config";

// Source: https://github.com/sveltejs/kit/blob/6419d3eaa7bf1b0a756b28f06a73f71fe042de0a/packages/kit/src/utils/filesystem.js
// License: MIT
/**
 * Resolves a file path without extension. Also handles \`/index\` if the path
 * actually points to a directory.
 * @param ctx
 * @param api
 * @returns
 */
const resolveEntry = (entry: string): string | null => {
  if (fs.existsSync(entry)) {
    const stats = fs.statSync(entry);
    if (stats.isDirectory()) {
      return resolveEntry(path.join(entry, "index"));
    }

    return entry;
  }
  const dir = path.dirname(entry);

  if (fs.existsSync(dir)) {
    const base = path.basename(entry);
    const files = fs.readdirSync(dir);

    const found = files.find((file) => file.replace(/\\.[^.]+$/, "") === base);

    if (found) return path.join(dir, found);
  }

  return null;
};

// We do not rely on \`@serwist/vite\`'s built-in \`buildPlugin\` because
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

// Here is the main logic: it stores your Serwist configuration, creates \`@serwist/vite\`'s
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
    // We will set these later in \`configureOptions\`.
    swSrc: null!,
    swDest: null!,
    swUrl: "/service-worker.js",
    // We will set this later in \`configureOptions\`.
    globDirectory: null!,
    globPatterns: [
      // Static assets.
      "client/**/*.{js,css,ico,png,svg,webp,json,webmanifest}",
      // Note: comment out the following if you don't have prerendered pages.
      "prerendered/pages/**/*.html",
      // Note: comment out the following if your prerendered pages do not have any data.
      "prerendered/dependencies/**/__data.json",
    ],
    globIgnores: ["server/*.*", "client/service-worker.js"],
    injectionPoint: "self.__SW_MANIFEST",
    integration: {
      closeBundleOrder: "pre",
      // These options depend on \`viteConfig\`, so we have to use \`@serwist/vite\`'s configuration hook.
      configureOptions(viteConfig, options) {
        const clientOutDir = path.resolve(viteConfig.root, viteConfig.build.outDir, "../client");

        // Kit fixes the service worker's name to 'service-worker.js'
        // This tells Serwist to replace \`injectionPoint\` with the precache manifest in the bundled service worker.
        if (viteConfig.isProduction) {
          options.swSrc = path.resolve(clientOutDir, "service-worker.js");
          options.swDest = path.resolve(clientOutDir, "service-worker.js");
        } else {
          // In development, you may want \`@serwist/vite\` to bundle your service worker and make it available at \`swUrl\`.
          // Resolve \`swSrc\` the same way as SvelteKit's.
          const swSrc = resolveEntry(path.join(viteConfig.root, config.kit?.files?.serviceWorker ?? "src/service-worker"));
          if (swSrc) {
            options.swSrc = swSrc;
            // We want to save the resulting development service worker somewhere on the filesystem
            // so that \`@serwist/build\` can pick it up.
            options.swDest = path.join(os.tmpdir(), \`serwist-vite-integration-svelte-\${crypto.randomUUID()}.js\`);
          } else {
            throw new Error(errors["invalid-sw-src"]);
          }
        }

        // \`clientOutDir\` is '.svelte-kit/output/client'. However, since we also want to precache prerendered
        // pages in the '.svelte-kit/output/prerendered' directory, we have to move one directory up.
        options.globDirectory = path.resolve(clientOutDir, "..");

        options.manifestTransforms = [
          // This \`manifestTransform\` makes the precache manifest valid.
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

              // Finally, prepend \`viteConfig.base\`.
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
    dontCacheBustURLsMatching: new RegExp(\`^client/\${buildAssetsDir}immutable/\`),
  };
  const ctx = createContext(options, undefined);
  const api = createApi(ctx);
  return [mainPlugin(ctx, api), devPlugin(ctx, api), buildPlugin(ctx, api)];
};

export default defineConfig({
  plugins: [sveltekit(), serwist()],
});`,
          lang: "typescript",
        },
      },
      {
        idPrefix: "vite-config-svelte",
        // We don't use Twoslash here to avoid our HTML payload blowing up
        useTwoslash: false,
      },
    ),
    serviceWorker: highlightCode(
      locals.highlighter,
      {
        "src/service-worker.ts": {
          code: `/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
import { defaultCache } from "@serwist/vite/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of \`injectionPoint\` to TypeScript.
// \`injectionPoint\` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// \`"self.__SW_MANIFEST"\`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
  	__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// See https://serwist.pages.dev/docs/serwist/core/serwist.
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    concurrency: 20,
    ignoreURLParametersMatching: [/^x-sveltekit-invalidated$/],
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  disableDevLogs: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "writing-a-sw", useTwoslash: false },
    ),
    manifestJson: highlightCode(
      locals.highlighter,
      {
        "static/manifest.json": {
          code: `{
  "name": "My awesome PWA app",
  "short_name": "PWA App",
  "icons": [
    {
      "src": "/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/android-chrome-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#FFFFFF",
  "background_color": "#FFFFFF",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait"
  // ...
}`,
          lang: "json",
        },
      },
      { idPrefix: "writing-webmanifest" },
    ),
    register: highlightCode(
      locals.highlighter,
      {
        "+layout.svelte": {
          code: `<script>
  import { getSerwist } from "virtual:serwist";

  const { children } = $props();

  $effect(() => {
    const loadSerwist = async () => {
      if ("serviceWorker" in navigator) {
        const serwist = await getSerwist();

        serwist?.addEventListener("installed", () => {
          console.log("Serwist installed!");
        });

        void serwist?.register();
      }
    }
    loadSerwist();
  });
</script>

<svelte:head>
  <title>My Awesome PWA App</title>
  <link rel="manifest" href="/manifest.webmanifest" />
  <meta name="application-name" content="PWA App" />
  <meta name="description" content="Best PWA app in the world!" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="PWA App" />
  <meta property="og:title" content="My Awesome PWA App" />
  <meta property="og:description" content="Best PWA app in the world!" />
  <meta name="twitter:title" content="My Awesome PWA App" />
  <meta name="twitter:description" content="Best PWA app in the world!" />
  <meta name="twitter:card" content="summary_large_image" /> 
  <meta name="theme-color" content="#FFFFFF" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="My Awesome PWA App" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="format-detection" content="telephone=no" />
</svelte:head>

{@render children()}`,
          lang: "svelte",
        },
      },
      { idPrefix: "updating-layout", useTwoslash: false },
    ),
  },
});
