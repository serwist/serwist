/// <reference lib="webworker" />
import { defaultCache } from "rolldown-plugin-serwist/worker";
import { addEventListeners, createSerwist, type PrecacheEntry, RuntimeCache, type SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = createSerwist({
  precache: {
    entries: self.__SW_MANIFEST,
  },
  skipWaiting: true,
  navigationPreload: true,
  clientsClaim: true,
  extensions: [new RuntimeCache(defaultCache)],
});

addEventListeners(serwist);
