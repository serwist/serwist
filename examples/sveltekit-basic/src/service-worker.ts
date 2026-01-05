/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
// Ensures that the `$service-worker` import has proper type definitions
/// <reference types="@sveltejs/kit" />
/// <reference types="../.svelte-kit/ambient.d.ts" />
import { defaultCache } from "@serwist/svelte/worker";
import { type PrecacheEntry, Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

const serwist = new Serwist({
  // Since `@serwist/svelte` is not run during development, we set
  // `precacheEntries` to `undefined`. This is a small caveat, as
  // precaching routes in development mode is usually undesired.
  precacheEntries: import.meta.env.PROD ? self.__SW_MANIFEST : undefined,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
