import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "registerRuntimeCaching - Abstracting away the APIs - @serwist/sw",
  ogImage: encodeOpenGraphImage({
    title: "registerRuntimeCaching",
    desc: "Abstracting away the APIs - @serwist/sw",
  }),
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { SerwistGlobalConfig } from "@serwist/core";
import { clientsClaim } from "@serwist/core";
import { ExpirationPlugin } from "@serwist/expiration";
import type { PrecacheEntry } from "@serwist/precaching";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "@serwist/strategies";
import { handlePrecaching, registerRuntimeCaching } from "@serwist/sw";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your \`injectionPoint\`.
    // \`injectionPoint\` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

handlePrecaching({ precacheEntries: self.__SW_MANIFEST });

registerRuntimeCaching(
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
);`,
          lang: "typescript",
        },
        "sw.js": {
          code: `// @filename: sw-decl.d.ts
import type { SerwistGlobalConfig } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

// @filename: sw.js
// @types: ./sw-decl.d.ts
// @lib: esnext,webworker
const self = /** @type {ServiceWorkerGlobalScope} */(/** @type {unknown} */(globalThis.self));
// ---cut-before---
import { clientsClaim } from "@serwist/core";
import { ExpirationPlugin } from "@serwist/expiration";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "@serwist/strategies";
import { handlePrecaching, registerRuntimeCaching } from "@serwist/sw";

self.skipWaiting();
clientsClaim();

handlePrecaching({ precacheEntries: self.__SW_MANIFEST });

registerRuntimeCaching(
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
);`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
