import type { RuntimeCaching } from "serwist";
import { cacheFirst, expiration, networkFirst, networkOnly, RangeRequestsPlugin, staleWhileRevalidate } from "serwist";

export const PAGES_CACHE_NAME = {
  rscPrefetch: "pages-rsc-prefetch",
  rsc: "pages-rsc",
  html: "pages",
} as const;

/**
 * The default, recommended list of caching strategies for applications
 * built with Next.js.
 *
 * @see https://serwist.pages.dev/docs/next/worker-exports#default-cache
 */
export const defaultCache: RuntimeCaching[] =
  process.env.NODE_ENV !== "production"
    ? [
        {
          matcher: /.*/i,
          handler: networkOnly(),
        },
      ]
    : [
        {
          matcher: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
          handler: cacheFirst({
            cacheName: "google-fonts-webfonts",
            plugins: [
              expiration({
                maxEntries: 4,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        {
          matcher: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
          handler: staleWhileRevalidate({
            cacheName: "google-fonts-stylesheets",
            plugins: [
              expiration({
                maxEntries: 4,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        {
          matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
          handler: staleWhileRevalidate({
            cacheName: "static-font-assets",
            plugins: [
              expiration({
                maxEntries: 4,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        {
          matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
          handler: staleWhileRevalidate({
            cacheName: "static-image-assets",
            plugins: [
              expiration({
                maxEntries: 64,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        {
          matcher: /\/_next\/static.+\.js$/i,
          handler: cacheFirst({
            cacheName: "next-static-js-assets",
            plugins: [
              expiration({
                maxEntries: 64,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        {
          matcher: /\/_next\/image\?url=.+$/i,
          handler: staleWhileRevalidate({
            cacheName: "next-image",
            plugins: [
              expiration({
                maxEntries: 64,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        {
          matcher: /\.(?:mp3|wav|ogg)$/i,
          handler: cacheFirst({
            cacheName: "static-audio-assets",
            plugins: [
              expiration({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                maxAgeFrom: "last-used",
              }),
              new RangeRequestsPlugin(),
            ],
          }),
        },
        {
          matcher: /\.(?:mp4|webm)$/i,
          handler: cacheFirst({
            cacheName: "static-video-assets",
            plugins: [
              expiration({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                maxAgeFrom: "last-used",
              }),
              new RangeRequestsPlugin(),
            ],
          }),
        },
        {
          matcher: /\.(?:js)$/i,
          handler: staleWhileRevalidate({
            cacheName: "static-js-assets",
            plugins: [
              expiration({
                maxEntries: 48,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        {
          matcher: /\.(?:css|less)$/i,
          handler: staleWhileRevalidate({
            cacheName: "static-style-assets",
            plugins: [
              expiration({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        {
          matcher: /\/_next\/data\/.+\/.+\.json$/i,
          handler: networkFirst({
            cacheName: "next-data",
            plugins: [
              expiration({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        {
          matcher: /\.(?:json|xml|csv)$/i,
          handler: networkFirst({
            cacheName: "static-data-assets",
            plugins: [
              expiration({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                maxAgeFrom: "last-used",
              }),
            ],
          }),
        },
        {
          // Exclude /api/auth/* to fix auth callback
          // https://github.com/serwist/serwist/discussions/28
          matcher: /\/api\/auth\/.*/,
          handler: networkOnly({
            networkTimeoutSeconds: 10, // fallback to cache if API does not response within 10 seconds
          }),
        },
        {
          matcher: ({ sameOrigin, url: { pathname } }) => sameOrigin && pathname.startsWith("/api/"),
          method: "GET",
          handler: networkFirst({
            cacheName: "apis",
            plugins: [
              expiration({
                maxEntries: 16,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
                maxAgeFrom: "last-used",
              }),
            ],
            networkTimeoutSeconds: 10, // fallback to cache if API does not response within 10 seconds
          }),
        },
        {
          matcher: ({ request, url: { pathname }, sameOrigin }) =>
            request.headers.get("RSC") === "1" && request.headers.get("Next-Router-Prefetch") === "1" && sameOrigin && !pathname.startsWith("/api/"),
          handler: networkFirst({
            cacheName: PAGES_CACHE_NAME.rscPrefetch,
            plugins: [
              expiration({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              }),
            ],
          }),
        },
        {
          matcher: ({ request, url: { pathname }, sameOrigin }) => request.headers.get("RSC") === "1" && sameOrigin && !pathname.startsWith("/api/"),
          handler: networkFirst({
            cacheName: PAGES_CACHE_NAME.rsc,
            plugins: [
              expiration({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              }),
            ],
          }),
        },
        {
          matcher: ({ request, url: { pathname }, sameOrigin }) =>
            request.headers.get("Content-Type")?.includes("text/html") && sameOrigin && !pathname.startsWith("/api/"),
          handler: networkFirst({
            cacheName: PAGES_CACHE_NAME.html,
            plugins: [
              expiration({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              }),
            ],
          }),
        },
        {
          matcher: ({ url: { pathname }, sameOrigin }) => sameOrigin && !pathname.startsWith("/api/"),
          handler: networkFirst({
            cacheName: "others",
            plugins: [
              expiration({
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              }),
            ],
          }),
        },
        {
          matcher: ({ sameOrigin }) => !sameOrigin,
          handler: networkFirst({
            cacheName: "cross-origin",
            plugins: [
              expiration({
                maxEntries: 32,
                maxAgeSeconds: 60 * 60, // 1 hour
              }),
            ],
            networkTimeoutSeconds: 10,
          }),
        },
        {
          matcher: /.*/i,
          method: "GET",
          handler: networkOnly(),
        },
      ];
