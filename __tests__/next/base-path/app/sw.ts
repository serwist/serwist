import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "serwist";
import { addEventListeners, createSerwist, RuntimeCache } from "serwist";

declare global {
  interface WorkerGlobalScope {
    // Change this attribute's name to your `injectionPoint`.
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = createSerwist({
  precache: {
    entries: self.__SW_MANIFEST,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  extensions: [new RuntimeCache(defaultCache)],
});

addEventListeners(serwist);
