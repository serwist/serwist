import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Home",
  ogImage: encodeOpenGraphImage("Home"),
  code: {
    frameworks: {
      next: highlightCode(
        locals.highlighter,
        {
          "next.config.mjs": {
            code: `import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

// https://nextjs.org/docs/app/api-reference/next-config-js
export default withSerwist({
  reactStrictMode: true,
});`,
            lang: "javascript",
          },
          "app/sw.ts": {
            code: `import type { SerwistGlobalConfig } from "@serwist/core";
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your \`injectionPoint\`.
    // \`injectionPoint\` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "nextjs-config-showcase" },
      ),
      webpack: highlightCode(
        locals.highlighter,
        {
          "webpack.config.ts": {
            code: `import fs from "node:fs";
import path from "node:path";

import { InjectManifest } from "@serwist/webpack-plugin";
import type { Configuration } from "webpack";

const dev = process.env.NODE_ENV === "development";
const rootDir = fs.realpathSync(process.cwd());
const srcDir = path.join(rootDir, "src");
const destDir = path.join(rootDir, "dist");

const clientEntry = path.resolve(srcDir, "client.ts");

export default {
  target: "web",
  name: "client",
  module: {
    rules: [
      // Insert rules...
    ],
  },
  entry: clientEntry,
  output: {
    publicPath: "/",
    path: path.resolve(destDir, "public"),
    filename: "static/js/[name]-[contenthash:8].js",
    chunkFilename: "static/js/[name]-[contenthash:8].chunk.js",
    assetModuleFilename: "static/media/[name].[hash][ext]",
  },
  plugins: [
    // swDest is automatically resolved to "$\{output.path}/sw.js"
    new InjectManifest({
      swSrc: path.resolve(srcDir, "sw.ts"),
      disablePrecacheManifest: dev,
      // Insert something...
      additionalPrecacheEntries: !dev ? [] : undefined,
    }),
  ],
} satisfies Configuration;`,
            lang: "typescript",
          },
          "src/sw.ts": {
            code: `import type { SerwistGlobalConfig } from "@serwist/core";
import { ExpirationPlugin } from "@serwist/expiration";
import type { PrecacheEntry } from "@serwist/precaching";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "@serwist/strategies";
import { installSerwist } from "@serwist/sw";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your \`injectionPoint\`.
    // \`injectionPoint\` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: /^https:\\/\\/fonts\\.(?:googleapis|gstatic)\\.com\\/.*/i,
      handler: new CacheFirst({
        cacheName: "google-fonts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 4,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
          }),
        ],
      }),
    },
    {
      matcher: /\\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 4,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          }),
        ],
      }),
    },
    {
      matcher: /\\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    {
      matcher: /\\.(?:js)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    {
      matcher: /\\.(?:css|less)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    {
      matcher: /\\.(?:json|xml|csv)$/i,
      handler: new NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    {
      matcher: /\\/api\\/.*$/i,
      method: "GET",
      handler: new NetworkFirst({
        cacheName: "apis",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 16,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
        networkTimeoutSeconds: 10, // fallback to cache if API does not response within 10 seconds
      }),
    },
    {
      matcher: /.*/i,
      handler: new NetworkFirst({
        cacheName: "others",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
        networkTimeoutSeconds: 10,
      }),
    },
  ],
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "webpack-config-showcase" },
      ),
      vite: highlightCode(
        locals.highlighter,
        {
          "vite.config.ts": {
            code: `import { serwist } from "@serwist/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // ...Other plugins
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
    }),
  ],
});`,
            lang: "typescript",
          },
          "src/sw.ts": {
            code: `import type { SerwistGlobalConfig } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";
import { defaultCache } from "@serwist/vite/worker";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your \`injectionPoint\`.
    // \`injectionPoint\` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "vite-config-showcase" },
      ),
      svelte: highlightCode(
        locals.highlighter,
        {
          "src/service-worker.ts": {
            code: `/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
import type { SerwistGlobalConfig } from "@serwist/core";
import { defaultCache, defaultIgnoreUrlParameters, getPrecacheManifest } from "@serwist/svelte/worker";
import { installSerwist } from "@serwist/sw";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {}
}

declare const self: ServiceWorkerGlobalScope;

self.__WB_CONCURRENT_PRECACHING = 10;

installSerwist({
  precacheEntries: getPrecacheManifest({
    staticRevisions: "static-v1",
  }),
  precacheOptions: {
    ignoreURLParametersMatching: defaultIgnoreUrlParameters,
  },
  cleanupOutdatedCaches: true,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  disableDevLogs: true,
  runtimeCaching: defaultCache,
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "svelte-config-showcase" },
      ),
      nuxt: highlightCode(
        locals.highlighter,
        {
          "nuxt.config.ts": {
            code: `/// <reference types="@serwist/nuxt" />
/// <reference types="nuxt" />
// ---cut-before---
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@serwist/nuxt"],
  serwist: {},
});`,
            lang: "typescript",
          },
          "service-worker/index.ts": {
            code: `/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import type { SerwistGlobalConfig } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";
import { defaultCache } from "@serwist/vite/worker";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your \`injectionPoint\`.
    // \`injectionPoint\` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: defaultCache,
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "nuxt-config-showcase" },
      ),
    },
    vanilla: highlightCode(
      locals.highlighter,
      {
        "build.ts": {
          code: `import { injectManifest } from "@serwist/build";
// Build something...
// Bundle the service worker...
const { count, size, warnings } = await injectManifest({
  swSrc: "app/sw.js",
  swDest: "dist/sw.js",
  globDirectory: "dist/static",
});
if (warnings.length > 0) {
  console.warn("[@serwist/build] Oopsie, there are warnings from Serwist:", warnings);
}
console.log(\`[@serwist/build] Manifest injected: \${count} files, totaling \${size} bytes.\`);`,
          lang: "typescript",
        },
      },
      { idPrefix: "no-framework-showcase" },
    ),
    customizing: highlightCode(
      locals.highlighter,
      {
        "@serwist/build": {
          code: `/**
 * A custom build ID.
 */
declare const BUILD_ID: string;
/**
 * Hash a file based on its contents.
 */
declare const hashFile: (file: string) => string;
/**
 * Whether the server is currently in development mode.
 */
declare const dev: boolean;
// ---cut-before---
import { injectManifest, type ManifestTransform } from "@serwist/build";

const manifestTransform: ManifestTransform = async (manifestEntries) => {
  const manifest = manifestEntries.map((m) => {
    if (m.url === "dQw4w9WgXcQ") m.url = "get-rick-rolled.mp4";
    if (m.revision === null) m.revision = crypto.randomUUID();
    return m;
  });
  return { manifest, warnings: [] };
};

injectManifest({
  swSrc: "app/sw.ts",
  swDest: "dist/sw.js",
  injectionPoint: "self.__HI_MOM",
  disablePrecacheManifest: dev,
  additionalPrecacheEntries: [
    {
      url: "/~offline",
      revision: BUILD_ID,
    },
    {
      url: "/manifest.json",
      revision: hashFile("static/manifest.json"),
    },
  ],
  // NOTE: THE SERWIST TEAM IS NOT THAT GOOD AT REGEXPS. JUST KNOW THAT.
  dontCacheBustURLsMatching: /^dist\\/static\\/([a-zA-Z0-9]+)\\.([a-z0-9]+)\\.(css|js)$/,
  manifestTransforms: [manifestTransform],
  maximumFileSizeToCacheInBytes: 7355608,
  modifyURLPrefix: {
    // hi-mom/index.GdhNyhN1.js -> index.GdhNyhN1.js
    "hi-mom/": "",
  },
  globDirectory: "dist/static",
  globFollow: false,
  globIgnores: ["**\\/node_modules\\/**\\/*"],
  globPatterns: [\"**\/*.{js,css,html,png,webmanifest,json}\"],
  globStrict: false,
  templatedURLs: {
    "/legacy-home": "legacy/home/*.html",
  },
});`,
          lang: "typescript",
        },
        "@serwist/webpack-plugin": {
          code: `/**
 * A custom build ID.
 */
declare const BUILD_ID: string;
/**
 * Hash a file based on its contents.
 */
declare const hashFile: (file: string) => string;
/**
 * Whether the server is currently in development mode.
 */
declare const dev: boolean;
// ---cut-before---
import { type ManifestTransform } from "@serwist/build";
import { InjectManifest } from "@serwist/webpack-plugin";
import webpack from "webpack";

const manifestTransform: ManifestTransform = async (manifestEntries) => {
  const manifest = manifestEntries.map((m) => {
    if (m.url === "dQw4w9WgXcQ") m.url = "get-rick-rolled.mp4";
    if (m.revision === null) m.revision = crypto.randomUUID();
    return m;
  });
  return { manifest, warnings: [] };
};

new InjectManifest({
  swSrc: "app/sw.ts",
  swDest: "dist/sw.js",
  injectionPoint: "self.__HI_MOM",
  disablePrecacheManifest: dev,
  additionalPrecacheEntries: [
    {
      url: "/~offline",
      revision: BUILD_ID,
    },
    {
      url: "/manifest.json",
      revision: hashFile("static/manifest.json"),
    },
  ],
  // NOTE: THE SERWIST TEAM IS NOT THAT GOOD AT REGEXPS. JUST KNOW THAT.
  dontCacheBustURLsMatching: /^dist\\/static\\/([a-zA-Z0-9]+)\\.([a-z0-9]+)\\.(css|js)$/,
  manifestTransforms: [manifestTransform],
  maximumFileSizeToCacheInBytes: 7355608,
  modifyURLPrefix: {
    // hi-mom/index.GdhNyhN1.js -> index.GdhNyhN1.js
    "hi-mom/": "",
  },
  chunks: ["some-chunk"],
  exclude: [/\\.map$/, /^manifest.*\\.js$/],
  excludeChunks: ["some-chunk-to-be-excluded"],
  // Usually you don't actually set this value unless you need to only include some
  // specific files.
  include: [() => true],
  compileSrc: true,
  webpackCompilationPlugins: [
    new webpack.DefinePlugin({
      "self.__CUSTOM_VALUE": "'hi mom'",
    }),
  ],
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "customizing-showcase" },
    ),
  },
});
