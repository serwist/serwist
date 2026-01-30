import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope {
    // Change this attribute's name to your `injectionPoint`.
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
