---
"@serwist/vite": major
"@serwist/svelte": major
---

refactor(svelte): moved Svelte integration into a separate package

- IMPORTANT NOTE: with this change, `@serwist/svelte` no longer makes use of any of the Serwist build tools.

  - This is because SvelteKit itself is capable of generating a list of precache manifest, and we'd like to leverage
    that capability. Essentially, Serwist, from now, only handles the service worker side for SvelteKit.

  - If the old behaviour is preferred, [manual integration](https://serwist.pages.dev/docs/vite/recipes/svelte) is required.

- To migrate, uninstall `@serwist/vite`, remove `@serwist/vite/integration/svelte.serwist` from vite.config.(js|ts), install `@serwist/svelte`, and then update your service-worker.ts:

  - Old:

  ```ts
  /// <reference no-default-lib="true"/>
  /// <reference lib="esnext" />
  /// <reference lib="webworker" />
  /// <reference types="@sveltejs/kit" />
  import type { PrecacheEntry } from "@serwist/precaching";
  import { installSerwist } from "@serwist/sw";
  import { defaultCache } from "@serwist/vite/worker";

  declare global {
    interface WorkerGlobalScope {
      __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
  }

  declare const self: ServiceWorkerGlobalScope;

  installSerwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    disableDevLogs: true,
    runtimeCaching: defaultCache,
  });
  ```

  - New:

  ```ts
  /// <reference no-default-lib="true"/>
  /// <reference lib="esnext" />
  /// <reference lib="webworker" />
  /// <reference types="@sveltejs/kit" />
  import {
    type StaticRevisions,
    // NOTE: `defaultCache` should now be imported from `@serwist/svelte/worker`.
    defaultCache,
    defaultIgnoreUrlParameters,
    getPrecacheManifest,
    staticAssets,
  } from "@serwist/svelte/worker";
  import { type SerwistGlobalConfig, Serwist } from "serwist";

  declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {}
  }

  declare const self: ServiceWorkerGlobalScope;

  const serwist = new Serwist({
    precacheEntries: getPrecacheManifest({
      // precacheImmutable: false,
      // precacheStatic: false,
      // precachePrerendered: false,
      staticRevisions: "static-v1",
    }),
    precacheOptions: {
      cleanupOutdatedCaches: true,
      ignoreURLParametersMatching: defaultIgnoreUrlParameters,
    },
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    disableDevLogs: true,
    runtimeCaching: defaultCache,
  });

  serwist.addEventListeners();
  ```
