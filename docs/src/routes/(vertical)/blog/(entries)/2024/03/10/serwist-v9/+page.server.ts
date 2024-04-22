import { highlightCode } from "$lib/highlightCode";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  toc: [
    {
      title: "Serwist 9.0.0",
      id: "serwist-v9",
      children: [
        {
          title: "Misc changes",
          id: "misc",
          children: [
            {
              title: "Dropped the CommonJS build",
              id: "dropped-the-commonjs-build",
            },
            {
              title: "Bumped minimum supported TypeScript and Node.js versions",
              id: "bumped-minimum-supported-ts-node",
            },
            {
              title: "Ship TypeScript source",
              id: "ship-ts-source",
            },
          ],
        },
        {
          title: "Core changes",
          id: "core-changes",
          children: [
            {
              title: "Merged all service worker packages",
              id: "merged-service-worker-packages",
            },
            {
              title: "Added Serwist",
              id: "added-serwist",
            },
            {
              title: "Added support for concurrent precaching",
              id: "concurrent-precaching",
            },
            {
              title: "Renamed RuntimeCaching.urlPattern to RuntimeCaching.matcher",
              id: "renamed-urlpattern",
            },
            {
              title: "Removed RuntimeCaching's support for string handlers",
              id: "removed-string-handlers",
            },
            {
              title: "Use PrecacheFallbackPlugin for fallbacks",
              id: "fallbacks-precache-fallback-plugin",
            },
            {
              title: "Added maxAgeFrom for ExpirationPlugin",
              id: "expiration-max-age-from",
            },
          ],
        },
        {
          title: "Build packages' changes",
          id: "build-packages-changes",
          children: [
            {
              title: "@serwist/build",
              id: "build",
              children: [
                {
                  title: "Migrated to Zod",
                  id: "migrate-to-zod",
                },
                {
                  title: "Moved framework-specific types out of @serwist/build",
                  id: "moved-framework-types",
                },
              ],
            },
            {
              title: "@serwist/webpack-plugin",
              id: "webpack-plugin",
              children: [
                {
                  title: "Removed mode",
                  id: "webpack-plugin-removed-mode",
                },
                {
                  title: "Allow webpack to be an optional peerDependency",
                  id: "webpack-plugin-webpack-optional",
                },
              ],
            },
            {
              title: "@serwist/next",
              id: "next",
              children: [
                {
                  title: 'Moved worker exports from "/browser" to "/worker"',
                  id: "renamed-next-browser-to-worker",
                },
                {
                  title: "Renamed cacheOnFrontEndNav to cacheOnNavigation",
                  id: "renamed-cofen-to-con",
                },
                {
                  title: `Changed defaultCache's "next-data"'s handler to NetworkFirst`,
                  id: "next-data-network-first",
                },
              ],
            },
            {
              title: "@serwist/svelte",
              id: "svelte",
              children: [
                {
                  title: "Moved Serwist's Svelte integration into a separate package",
                  id: "moved-svelte-integration",
                },
              ],
            },
            {
              title: "@serwist/vite",
              id: "vite",
              children: [
                {
                  title: "Moved getSerwist from @serwist/vite/browser to virtual:serwist",
                  id: "moved-get-serwist",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  code: {
    misc: {
      esmOnly: highlightCode(
        locals.highlighter,
        {
          Old: {
            code: `// @ts-check
const withSerwist = require("@serwist/next").default({
  cacheOnFrontEndNav: true,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withSerwist(nextConfig);`,
            lang: "typescript",
          },
          New: {
            code: `// @ts-check
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = async () => {
  const withSerwist = (await import("@serwist/next")).default({
    cacheOnNavigation: true,
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
  });
  return withSerwist(nextConfig);
};`,
            lang: "typescript",
          },
        },
        { idPrefix: "dropped-the-commonjs-build", useTwoslash: false },
      ),
      minimumSupportedTsNode: highlightCode(
        locals.highlighter,
        {
          bash: {
            code: `# Change to your preferred way of updating Node.js
nvm use --lts
# Change to your package manager
npm i -D typescript@latest`,
            lang: "bash",
          },
        },
        { idPrefix: "bumped-minimum-supported-ts-node" },
      ),
    },
    installSerwist: highlightCode(
      locals.highlighter,
      {
        npm: {
          code: "npm i -D serwist",
          lang: "bash",
        },
        yarn: {
          code: "yarn add -D serwist",
          lang: "bash",
        },
        pnpm: {
          code: "pnpm add -D serwist",
          lang: "bash",
        },
        bun: {
          code: "bun add -D serwist",
          lang: "bash",
        },
      },
      {
        idPrefix: "install-serwist",
      },
    ),
    legacyStringHandlers: highlightCode(
      locals.highlighter,
      {
        Old: {
          code: `import { defaultCache } from "@serwist/next/browser";
import { installSerwist } from "@serwist/sw";

installSerwist({
  // Other options...
  runtimeCaching: [
    {
      urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
        request.headers.get("RSC") === "1" && request.headers.get("Next-Router-Prefetch") === "1" && sameOrigin && !pathname.startsWith("/api/"),
      // OLD: a string handler alongside \`options\`.
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-rsc-prefetch",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
        request.headers.get("RSC") === "1" && sameOrigin && !pathname.startsWith("/api/"),
      // OLD: a string handler alongside \`options\`.
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-rsc",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
        request.headers.get("Content-Type")?.includes("text/html") && sameOrigin && !pathname.startsWith("/api/"),
      // OLD: a string handler alongside \`options\`.
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    ...defaultCache,
  ],
});`,
          lang: "typescript",
        },
        New: {
          code: `import { defaultCache, PAGES_CACHE_NAME } from "@serwist/next/worker";
import { Serwist } from "serwist";

const serwist = new Serwist({
  // Other options...
  runtimeCaching: [
    {
      matcher: ({ request, url: { pathname }, sameOrigin }) =>
        request.headers.get("RSC") === "1" && request.headers.get("Next-Router-Prefetch") === "1" && sameOrigin && !pathname.startsWith("/api/"),
      // NEW: an initialized instance.
      handler: new NetworkFirst({
        cacheName: PAGES_CACHE_NAME.rscPrefetch,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          }),
        ],
      }),
    },
    {
      matcher: ({ request, url: { pathname }, sameOrigin }) => request.headers.get("RSC") === "1" && sameOrigin && !pathname.startsWith("/api/"),
      // NEW: an initialized instance.
      handler: new NetworkFirst({
        cacheName: PAGES_CACHE_NAME.rsc,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          }),
        ],
      }),
    },
    {
      matcher: ({ request, url: { pathname }, sameOrigin }) =>
        request.headers.get("Content-Type")?.includes("text/html") && sameOrigin && !pathname.startsWith("/api/"),
      // NEW: an initialized instance.
      handler: new NetworkFirst({
        cacheName: PAGES_CACHE_NAME.html,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "removed-string-handlers", useTwoslash: false },
    ),
    nextRenamedWorker: highlightCode(
      locals.highlighter,
      {
        Old: {
          code: `import { defaultCache } from "@serwist/next/browser";`,
          lang: "typescript",
        },
        New: {
          code: `import { defaultCache } from "@serwist/next/worker";`,
          lang: "typescript",
        },
      },
      { idPrefix: "renamed-next-browser-to-worker", useTwoslash: false },
    ),
    nextRenamedCon: highlightCode(
      locals.highlighter,
      {
        Old: {
          code: `const withSerwist = withSerwistInit({
  // Other options...
  cacheOnFrontEndNav: true,
});`,
          lang: "javascript",
        },
        New: {
          code: `const withSerwist = withSerwistInit({
  // Other options...
  cacheOnNavigation: true,
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "renamed-next-cofen-to-con", useTwoslash: false },
    ),
    svelteMigration: highlightCode(
      locals.highlighter,
      {
        Old: {
          code: `/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";
import { defaultCache } from "@serwist/vite/worker";

declare global {
  interface WorkerGlobalScope {
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
        New: {
          code: `/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
import type { StaticRevisions } from "@serwist/svelte/worker";
import { defaultCache, defaultIgnoreUrlParameters, getPrecacheManifest } from "@serwist/svelte/worker";
import type { SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {}
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: getPrecacheManifest({
    // precacheImmutable: false,
    // precacheStatic: false,
    // precachePrerendered: false,
    staticRevisions: "static-assets-v1",
  }),
  precacheOptions: {
    cleanupOutdatedCaches: true,
    concurrency: 20,
    ignoreURLParametersMatching: defaultIgnoreUrlParameters,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "moved-svelte-integration", useTwoslash: false },
    ),
    viteVirtual: highlightCode(
      locals.highlighter,
      {
        Old: {
          code: `import { getSerwist } from "@serwist/vite/browser";`,
          lang: "typescript",
        },
        New: {
          code: `import { getSerwist } from "virtual:serwist";`,
          lang: "typescript",
        },
      },
      { idPrefix: "vite-virtual", useTwoslash: false },
    ),
  },
});
