import { defaultCache } from "@serwist/next/browser";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
  // Change this attribute's name to your `injectionPoint`.
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

const revision = crypto.randomUUID();

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbackEntries: [
    {
      matcher({ request }) {
        return request.destination === "document";
      },
      url: "/~offline",
      revision,
    },
  ],
});
