# @serwist/svelte

## 9.0.0-preview.8

### Patch Changes

- Updated dependencies [[`b1df273`](https://github.com/serwist/serwist/commit/b1df273379ee018fd850f962345740874c9fd54d)]:
  - @serwist/expiration@9.0.0-preview.8
  - @serwist/strategies@9.0.0-preview.8
  - @serwist/sw@9.0.0-preview.8

## 9.0.0-preview.7

### Major Changes

- [`db9f327`](https://github.com/serwist/serwist/commit/db9f3275cd2f78287516668b50a62cff7c1a4d1d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(svelte): moved Svelte integration into a separate package

  - IMPORTANT NOTE: with this change, `@serwist/svelte` no longer makes use of any of the Serwist build tools.

    - This is because SvelteKit itself is capable of generating a list of precache manifest, and we'd like to leverage
      that capability. Essentially, Serwist, from now, only handles the service worker side for SvelteKit.

    - If the old behaviour is preferred, manual Serwist integration is required. You may look at the source code of `@serwist/vite/integration/svelte@8.4.4`
      to see how this should be implemented. A guide will be added to the docs soon.

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
    import type { SerwistGlobalConfig } from "@serwist/core";
    import {
      type StaticRevisions,
      // NOTE: `defaultCache` should now be imported from `@serwist/svelte/worker`.
      defaultCache,
      defaultIgnoreUrlParameters,
      getPrecacheManifest,
      staticAssets,
    } from "@serwist/svelte/worker";
    import { installSerwist } from "@serwist/sw";

    declare global {
      interface WorkerGlobalScope extends SerwistGlobalConfig {}
    }

    declare const self: ServiceWorkerGlobalScope;

    const staticRevision = "static-assets-v1";

    // Prefer concurrent precaching over sequential one, since there
    // are a lot of assets to precache.
    self.__WB_CONCURRENT_PRECACHING = 10;

    installSerwist({
      precacheEntries: getPrecacheManifest({
        // precacheImmutable: false,
        // precacheStatic: false,
        // precachePrerendered: false,
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
    ```

### Patch Changes

- Updated dependencies []:
  - @serwist/expiration@9.0.0-preview.7
  - @serwist/strategies@9.0.0-preview.7
  - @serwist/sw@9.0.0-preview.7
