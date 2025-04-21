/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/astro/worker";
import { RuntimeCacheController, Serwist, type PrecacheEntry } from "serwist";

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
    concurrency: 10,
  },
  controllers: [new RuntimeCacheController(defaultCache)],
  skipWaiting: true,
  clientsClaim: true,
});

serwist.addEventListeners();
