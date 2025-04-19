import type { RuntimeCaching } from "serwist";
import { CacheFirst, ExpirationPlugin, NetworkFirst, NetworkOnly, StaleWhileRevalidate } from "serwist";

/**
 * The default, recommended list of caching strategies for applications
 * built with Vite.
 *
 * @see https://serwist.pages.dev/docs/vite/worker-exports#default-cache
 */
export const defaultCache: RuntimeCaching[] = import.meta.env.DEV
  ? [
      {
        matcher: /.*/i,
        handler: new NetworkOnly(),
      },
    ]
  : [
      {
        matcher: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        handler: new CacheFirst({
          cacheName: "google-fonts",
          plugins: [
            new ExpirationPlugin({
              maxEntries: 4,
              maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        handler: new StaleWhileRevalidate({
          cacheName: "static-font-assets",
          plugins: [
            new ExpirationPlugin({
              maxEntries: 4,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: new StaleWhileRevalidate({
          cacheName: "static-image-assets",
          plugins: [
            new ExpirationPlugin({
              maxEntries: 64,
              maxAgeSeconds: 24 * 60 * 60, // 24 hours
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\.(?:js)$/i,
        handler: new StaleWhileRevalidate({
          cacheName: "static-js-assets",
          plugins: [
            new ExpirationPlugin({
              maxEntries: 32,
              maxAgeSeconds: 24 * 60 * 60, // 24 hours
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\.(?:css|less)$/i,
        handler: new StaleWhileRevalidate({
          cacheName: "static-style-assets",
          plugins: [
            new ExpirationPlugin({
              maxEntries: 32,
              maxAgeSeconds: 24 * 60 * 60, // 24 hours
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\.(?:json|xml|csv)$/i,
        handler: new NetworkFirst({
          cacheName: "static-data-assets",
          plugins: [
            new ExpirationPlugin({
              maxEntries: 32,
              maxAgeSeconds: 24 * 60 * 60, // 24 hours
              maxAgeFrom: "last-used",
            }),
          ],
        }),
      },
      {
        matcher: /\/api\/.*$/i,
        method: "GET",
        handler: new NetworkFirst({
          cacheName: "apis",
          plugins: [
            new ExpirationPlugin({
              maxEntries: 16,
              maxAgeSeconds: 24 * 60 * 60, // 24 hours
              maxAgeFrom: "last-used",
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
              maxAgeFrom: "last-used",
            }),
          ],
          networkTimeoutSeconds: 10,
        }),
      },
    ];
