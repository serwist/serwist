/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
import type { SerwistGlobalConfig } from "@serwist/core";
import { defaultCache, defaultIgnoreUrlParameters, getPrecacheManifest } from "@serwist/svelte/worker";
import { installSerwist } from "@serwist/sw";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {}
}

declare const self: ServiceWorkerGlobalScope;

self.__WB_CONCURRENT_PRECACHING = 10;

installSerwist({
  precacheEntries: getPrecacheManifest(),
  precacheOptions: {
    ignoreURLParametersMatching: defaultIgnoreUrlParameters,
  },
  cleanupOutdatedCaches: true,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: defaultCache,
});
