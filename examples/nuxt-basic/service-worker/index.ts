/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { addEventListeners, createSerwist, RuntimeCache } from "serwist";
import { defaultCache } from "vite-plugin-serwist/worker";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
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
