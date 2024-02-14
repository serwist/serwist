/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />
import type { SerwistGlobalConfig } from "@serwist/core";
import { type StaticRevisions, staticAssets, defaultCache, defaultIgnoreUrlParameters, getPrecacheManifest } from "@serwist/svelte/worker";
import { installSerwist } from "@serwist/sw";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {}
}

declare const self: ServiceWorkerGlobalScope;

self.__WB_CONCURRENT_PRECACHING = 10;

// IMPORTANT NOTE: BUMP THIS UP SHOULD YOU UPDATE
// THE STATIC FOLDER.
const staticRevision = "serwist-docs-static-v1";

installSerwist({
  precacheEntries: getPrecacheManifest({
    staticRevisions: staticAssets.reduce((prev, cur) => {
      prev[cur] = staticRevision;
      return prev;
    }, {} as StaticRevisions),
  }),
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
