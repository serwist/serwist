# @serwist/svelte

## 10.0.0-preview.2
### Major Changes



- [`af82ab6`](https://github.com/serwist/serwist/commit/af82ab622e0ff6b4669fd49e9489e7497d232b29) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(all): bump Node.js requirement to 20.0.0 or newer
  
  - Node.js 18 goes EoL on April 30th, 2025, so Serwist now requires Node.js 20 or newer.
  
  - This also allows us to bump `glob` and `rimraf`.

### Patch Changes

- Updated dependencies [[`af82ab6`](https://github.com/serwist/serwist/commit/af82ab622e0ff6b4669fd49e9489e7497d232b29)]:
  - serwist@10.0.0-preview.2

## 9.1.0-preview.0

### Patch Changes

- Updated dependencies []:
  - serwist@9.1.0-preview.0

## 9.0.14

### Patch Changes

- Updated dependencies []:
  - serwist@9.0.14

## 9.0.11

### Patch Changes

- [`cdefdc3`](https://github.com/serwist/serwist/commit/cdefdc32247f45a553a7a7ce4ff549fdf04290ce) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`cdefdc3`](https://github.com/serwist/serwist/commit/cdefdc32247f45a553a7a7ce4ff549fdf04290ce)]:
  - serwist@9.0.11

## 9.0.10

### Patch Changes

- Updated dependencies []:
  - serwist@9.0.10

## 9.0.9

### Patch Changes

- Updated dependencies []:
  - serwist@9.0.9

## 9.0.8

### Patch Changes

- Updated dependencies [[`ffb64c4`](https://github.com/serwist/serwist/commit/ffb64c4d26a7bd67525aa14b10c156fe04cadcd6)]:
  - serwist@9.0.8

## 9.0.7

### Patch Changes

- Updated dependencies []:
  - serwist@9.0.7

## 9.0.6

### Patch Changes

- Updated dependencies [[`1e9cc3c`](https://github.com/serwist/serwist/commit/1e9cc3c45511f93d328555eb090df0e613bca403)]:
  - serwist@9.0.6

## 9.0.5

### Patch Changes

- Updated dependencies []:
  - serwist@9.0.5

## 9.0.4

### Patch Changes

- [`db66e96`](https://github.com/serwist/serwist/commit/db66e96cb7fd8857200efc261d60cffaca1c0177) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`db66e96`](https://github.com/serwist/serwist/commit/db66e96cb7fd8857200efc261d60cffaca1c0177)]:
  - serwist@9.0.4

## 9.0.3

### Patch Changes

- [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): updated all dependencies

  - We have updated all dependencies to latest, as usual.

- [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(frameworks): use `NetworkOnly` for `defaultCache` in dev

  - If we set `runtimeCaching` to an empty array, all preload responses are discarded, causing certain browsers to log a certain error message. This change fixes that error for developers using `defaultCache` in development mode.

- Updated dependencies [[`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed), [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed), [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed)]:
  - serwist@9.0.3

## 9.0.2

### Patch Changes

- Updated dependencies []:
  - serwist@9.0.2

## 9.0.1

### Patch Changes

- Updated dependencies []:
  - serwist@9.0.0

## 9.0.0

### Major Changes

- [#123](https://github.com/serwist/serwist/pull/123) [`db9f327`](https://github.com/serwist/serwist/commit/db9f3275cd2f78287516668b50a62cff7c1a4d1d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(svelte): moved Svelte integration into a separate package

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

### Patch Changes

- [#123](https://github.com/serwist/serwist/pull/123) [`db7776e`](https://github.com/serwist/serwist/commit/db7776e6f55f4d1cf62ea8975c8460cb92c28138) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(svelte,next,vite): force `defaultCache` to only use `NetworkOnly` in development mode

  - This is to prevent files from being accidentally cached during development mode, which isn't the behaviour you would expect to see anyway.
  - URLs that are matched by these entries in production are now handled by `NetworkOnly` in development. No option to override this behaviour is provided, for it would provide little to no value. If you do need runtime caching to work during development, you have to copy `defaultCache` into your code.
  - As a reminder for those who extend `defaultCache`, it should be placed below any custom entry, since such an entry wouldn't ever be matched otherwise.

- Updated dependencies [[`b1df273`](https://github.com/serwist/serwist/commit/b1df273379ee018fd850f962345740874c9fd54d), [`c65578b`](https://github.com/serwist/serwist/commit/c65578b68f1ae88822238c3c03aa5e859a4f2b7e), [`b273b8c`](https://github.com/serwist/serwist/commit/b273b8cd9a240f8bf8ba357339e2e2d5dc2e8870), [`6c3e789`](https://github.com/serwist/serwist/commit/6c3e789724533dab23a6f5afb2a0f40d8f26bf16), [`4a5d51a`](https://github.com/serwist/serwist/commit/4a5d51ac8e9ed97b97754d8164990a08be65846d), [`7b55ac5`](https://github.com/serwist/serwist/commit/7b55ac526a73826cb2d179a863d7eb29182616ee), [`e4c00af`](https://github.com/serwist/serwist/commit/e4c00af72a9bd6a9d06e8a51d7db0006c732f7fd), [`dc12dda`](https://github.com/serwist/serwist/commit/dc12ddad60526db921b557f8dc5808ba17fc4d8e), [`10c3c17`](https://github.com/serwist/serwist/commit/10c3c17a0021c87886c47c2588d8beca1cb21535), [`4a5d51a`](https://github.com/serwist/serwist/commit/4a5d51ac8e9ed97b97754d8164990a08be65846d)]:
  - serwist@9.0.0

## 9.0.0-preview.26

### Patch Changes

- [`3a16582`](https://github.com/serwist/serwist/commit/3a165826cd07bb02f2cd2a8a7bedaf7c2bbeaed5) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: second stability test before stable release

- Updated dependencies [[`3a16582`](https://github.com/serwist/serwist/commit/3a165826cd07bb02f2cd2a8a7bedaf7c2bbeaed5)]:
  - serwist@9.0.0-preview.26

## 9.0.0-preview.25

### Patch Changes

- [`7e00b79`](https://github.com/serwist/serwist/commit/7e00b79d3888fcdd0b2ac0c2cf5060b9cf91a9ea) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: stability test before stable release

- Updated dependencies [[`7e00b79`](https://github.com/serwist/serwist/commit/7e00b79d3888fcdd0b2ac0c2cf5060b9cf91a9ea)]:
  - serwist@9.0.0-preview.25

## 9.0.0-preview.24

### Patch Changes

- Updated dependencies [e4c00af]
  - serwist@9.0.0-preview.24

## 9.0.0-preview.23

### Patch Changes

- @serwist/expiration@9.0.0-preview.23
- @serwist/strategies@9.0.0-preview.23
- @serwist/core@9.0.0-preview.23
- @serwist/sw@9.0.0-preview.23

## 9.0.0-preview.22

### Patch Changes

- @serwist/expiration@9.0.0-preview.22
- @serwist/strategies@9.0.0-preview.22
- @serwist/core@9.0.0-preview.22
- @serwist/sw@9.0.0-preview.22

## 9.0.0-preview.21

### Patch Changes

- @serwist/expiration@9.0.0-preview.21
- @serwist/strategies@9.0.0-preview.21
- @serwist/core@9.0.0-preview.21
- @serwist/sw@9.0.0-preview.21

## 9.0.0-preview.20

### Patch Changes

- Updated dependencies [10c9394]
  - @serwist/sw@9.0.0-preview.20
  - @serwist/expiration@9.0.0-preview.20
  - @serwist/strategies@9.0.0-preview.20
  - @serwist/core@9.0.0-preview.20

## 9.0.0-preview.19

### Patch Changes

- 6d294f9: refactor: migrate to GitLab

  - Serwist and `@ducanh2912/next-pwa` have migrated to GitLab.
  - This was the result of GitHub flagging my account, organizations, and repositories as spam. Sorry for the inconvenience.

- Updated dependencies [6d294f9]
  - @serwist/expiration@9.0.0-preview.19
  - @serwist/strategies@9.0.0-preview.19
  - @serwist/core@9.0.0-preview.19
  - @serwist/sw@9.0.0-preview.19

## 9.0.0-preview.18

### Patch Changes

- Updated dependencies [[`c65578b`](https://github.com/serwist/serwist/commit/c65578b68f1ae88822238c3c03aa5e859a4f2b7e)]:
  - @serwist/expiration@9.0.0-preview.18
  - @serwist/strategies@9.0.0-preview.18
  - @serwist/sw@9.0.0-preview.18
  - @serwist/core@9.0.0-preview.18

## 9.0.0-preview.17

### Patch Changes

- Updated dependencies [[`97b36c7`](https://github.com/serwist/serwist/commit/97b36c752c4f0ea9bc7beaf41733c5dcc5d02cb9)]:
  - @serwist/sw@9.0.0-preview.17
  - @serwist/core@9.0.0-preview.17
  - @serwist/expiration@9.0.0-preview.17
  - @serwist/strategies@9.0.0-preview.17

## 9.0.0-preview.16

### Patch Changes

- [`db7776e`](https://github.com/serwist/serwist/commit/db7776e6f55f4d1cf62ea8975c8460cb92c28138) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(svelte,next,vite): force `defaultCache` to only use NetworkOnly in development mode

  - This is to prevent files from being accidentally cached during development mode, which isn't the behaviour you would expect to see anyway.
  - URLs that are matched by these entries in production are now handled by NetworkOnly in development. No option to override this behaviour is provided, for it would provide little to no value. If you do need runtime caching to work during development, you have to copy `defaultCache` into your code.
  - As a reminder for those who extend `defaultCache`, it should be placed below any custom entry, since such an entry wouldn't ever be matched otherwise.

- Updated dependencies []:
  - @serwist/core@9.0.0-preview.16
  - @serwist/expiration@9.0.0-preview.16
  - @serwist/strategies@9.0.0-preview.16
  - @serwist/sw@9.0.0-preview.16

## 9.0.0-preview.15

### Patch Changes

- Updated dependencies [[`c47a8b2`](https://github.com/serwist/serwist/commit/c47a8b27c0dcd4fad4195b15eb7bd7b0a7c234c8)]:
  - @serwist/expiration@9.0.0-preview.15
  - @serwist/sw@9.0.0-preview.15
  - @serwist/core@9.0.0-preview.15
  - @serwist/strategies@9.0.0-preview.15

## 9.0.0-preview.14

### Patch Changes

- Updated dependencies []:
  - @serwist/core@9.0.0-preview.14
  - @serwist/expiration@9.0.0-preview.14
  - @serwist/strategies@9.0.0-preview.14
  - @serwist/sw@9.0.0-preview.14

## 9.0.0-preview.13

### Patch Changes

- Updated dependencies []:
  - @serwist/core@9.0.0-preview.13
  - @serwist/expiration@9.0.0-preview.13
  - @serwist/strategies@9.0.0-preview.13
  - @serwist/sw@9.0.0-preview.13

## 9.0.0-preview.12

### Patch Changes

- Updated dependencies [[`b273b8c`](https://github.com/serwist/serwist/commit/b273b8cd9a240f8bf8ba357339e2e2d5dc2e8870)]:
  - @serwist/sw@9.0.0-preview.12
  - @serwist/expiration@9.0.0-preview.12
  - @serwist/strategies@9.0.0-preview.12

## 9.0.0-preview.11

### Major Changes

- [`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor: use iterables

  - Serwist now uses iterables in its code. For instance, `Headers.prototype.entries()` can be noticed at parts of `@serwist/cacheable-response`.
  - This is partly thanks to our Node.js requirement being bumped to 18.0.0. Iterables have been supported in all major browsers for ages, so they wouldn't be a problem (hell, all browsers that support service workers have support for iterables).
  - Still, since this requires us to enforce the use of Node.js 18.0.0 or later, it is marked a breaking change.

### Patch Changes

- Updated dependencies [[`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063)]:
  - @serwist/expiration@9.0.0-preview.11
  - @serwist/strategies@9.0.0-preview.11
  - @serwist/sw@9.0.0-preview.11

## 9.0.0-preview.10

### Patch Changes

- Updated dependencies []:
  - @serwist/expiration@9.0.0-preview.10
  - @serwist/strategies@9.0.0-preview.10
  - @serwist/sw@9.0.0-preview.10

## 9.0.0-preview.9

### Patch Changes

- Updated dependencies [[`7e42ad9`](https://github.com/serwist/serwist/commit/7e42ad912d96fdda160a7aad9a5548e7c046bc27)]:
  - @serwist/strategies@9.0.0-preview.9
  - @serwist/sw@9.0.0-preview.9
  - @serwist/expiration@9.0.0-preview.9

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
    import { Serwist } from "serwist";

    declare global {
      interface WorkerGlobalScope extends SerwistGlobalConfig {}
    }

    declare const self: ServiceWorkerGlobalScope;

    const staticRevision = "static-assets-v1";

    // Prefer concurrent precaching over sequential one, since there
    // are a lot of assets to precache.
    self.__WB_CONCURRENT_PRECACHING = 10;

    const serwist = new Serwist({
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

### Patch Changes

- Updated dependencies []:
  - @serwist/expiration@9.0.0-preview.7
  - @serwist/strategies@9.0.0-preview.7
  - @serwist/sw@9.0.0-preview.7
