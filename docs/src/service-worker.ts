import { defaultCache } from "@serwist/vite/worker";
import { CacheableResponsePlugin, CacheFirst, ExpirationPlugin, type PrecacheEntry, RangeRequestsPlugin, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    concurrency: 20,
    ignoreURLParametersMatching: [/^x-sveltekit-invalidated$/],
  },
  navigationPreload: false,
  runtimeCaching: [
    {
      matcher({ request }) {
        return request.destination === "video";
      },
      handler: new CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 16,
            maxAgeSeconds: 30 * 24 * 60 * 60, // ~30 days
            maxAgeFrom: "last-used",
          }),
          new CacheableResponsePlugin({
            statuses: [200],
          }),
          new RangeRequestsPlugin(),
        ],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
