# @serwist/google-analytics

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

- [#123](https://github.com/serwist/serwist/pull/123) [`b1df273`](https://github.com/serwist/serwist/commit/b1df273379ee018fd850f962345740874c9fd54d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(core): allow non-Promise return types for `SerwistPlugin` callbacks

  - Usually you don't need to do anything to migrate, but we still mark it as a breaking change because changing a function's signature is considered a breaking one in this project.

- [#123](https://github.com/serwist/serwist/pull/123) [`7b55ac5`](https://github.com/serwist/serwist/commit/7b55ac526a73826cb2d179a863d7eb29182616ee) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(js): dropped the CommonJS build

  - Serwist is now an ESM-only project.
  - This was done because our tooling around supporting CJS had always been crappy: it was slow, had no way of supporting emitting `.d.cts` (we used to copy `.d.ts` to `.d.cts`), and was too error-prone (there were various issues of our builds crashing due to an ESM-only package slipping in).
  - If you already use ESM, there's nothing to be done. Great! Otherwise, to migrate:

    - Migrate to ESM if possible.
    - Otherwise, use dynamic imports. For example, to migrate to the new `@serwist/next`:

      - Old:

      ```js
      // @ts-check
      const withSerwist = require("@serwist/next").default({
        cacheOnNavigation: true,
        swSrc: "app/sw.ts",
        swDest: "public/sw.js",
      });
      /** @type {import("next").NextConfig} */
      const nextConfig = {
        reactStrictMode: true,
      };

      module.exports = withSerwist(nextConfig);
      ```

      - New:

      ```js
      // @ts-check
      /** @type {import("next").NextConfig} */
      const nextConfig = {
        reactStrictMode: true,
      };

      module.exports = async () => {
        const withSerwist = (await import("@serwist/next")).default({
          cacheOnNavigation: true,
          swSrc: "app/sw.ts",
          swDest: "public/sw.js",
        });
        return withSerwist(nextConfig);
      };
      ```

    - If all else fails, use `require(esm)`. This may or may not be supported on your current Node.js version.

- [#123](https://github.com/serwist/serwist/pull/123) [`e4c00af`](https://github.com/serwist/serwist/commit/e4c00af72a9bd6a9d06e8a51d7db0006c732f7fd) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(core): replaced `installSerwist`, `PrecacheController`, and `Router` with `Serwist`

  - ``installSerwist`, `PrecacheController`, and `Router` have been moved to `serwist/legacy`. Their functionalities have been merged into the `Serwist` class.
  - The new `Serwist` class does NOT have a singleton instance. As such, `serwist.initializeGoogleAnalytics()` and `@serwist/recipes`'s functions now require you to pass in your own `Serwist` instance.
  - This was done because separating Serwist's functionalities into three separate classes, namely `PrecacheController`, `Router`, and `Serwist`, was not only unnecessary, but it also required the code to be rather... boilerplatey. In the past, to set up, you needed to install all the necessary packages (`workbox-routing`, `workbox-precaching`, `workbox-strategies`), import all the necessary classes (`PrecacheController`, `Router`,...), and know all the APIs needed (`PrecacheController.precache`, `Router.registerRoute`, `new PrecacheRoute()`, runtime caching strategies,...) to get yourself started. To simplify that whole process, the Workbox team provided GenerateSW, which allowed you to create a service worker without having to write one. However, this design was not my cup of tea, one of the reasons of which was that you needed to migrate from GenerateSW to InjectManifest if you needed to do anything remotely complex, so I replaced it with `installSerwist`. Still, I was not satisfied by the result. I wanted an API where things are simple enough that you don't need to have multiple ways of doing one same thing, some more straightforward than others. This change where we merge the three classes is an effort to simplify and unify the API.
  - To migrate, either:

    - Use the new `Serwist` class:

    ```ts
    import { Serwist } from "serwist";

    const serwist = new Serwist({
      // Initial list of precache entries.
      precacheEntries: [],
      // Initial list of runtime caching strategies.
      runtimeCaching: [],
    });

    // Additionally append another list of precache entries.
    // Make sure there are no duplicates in the initial list.
    serwist.addToPrecacheList([]);

    // Register another runtime caching strategy.
    serwist.registerRoute(new Route(/\/api\/.*\/*.json/, new NetworkOnly(), "POST"));

    // This should be called before `Serwist.addEventListeners`.
    self.addEventListener("message", (event) => {
      if (event.data && event.data.type === "YOUR_MESSAGE_TYPE") {
        // Do something
      }
    });

    // Finally, add Serwist's listeners.
    serwist.addEventListeners();
    ```

    - Or import `PrecacheController` and `Router` from `serwist/legacy`:

    ```ts
    import { PrecacheController, Router } from "serwist/legacy";
    ```

### Minor Changes

- [#123](https://github.com/serwist/serwist/pull/123) [`c65578b`](https://github.com/serwist/serwist/commit/c65578b68f1ae88822238c3c03aa5e859a4f2b7e) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor: merge service worker modules into `serwist`

  - These service worker modules have been merged into `serwist`:

    - Modules now located at `serwist`:

      - `@serwist/navigation-preload`:

        - `@serwist/navigation-preload.disable` -> `serwist.disableNavigationPreload`.
        - `@serwist/navigation-preload.enable` -> `serwist.enableNavigationPreload`.
        - `@serwist/navigation-preload.isSupported` -> `serwist.isNavigationPreloadSupported`.

      - `@serwist/background-sync`

        - `@serwist/background-sync.QueueEntry` -> `serwist.BackgroundSyncQueueEntry`
        - `@serwist/background-sync.QueueOptions` -> `serwist.BackgroundSyncQueueOptions`
        - `@serwist/background-sync.Queue` -> `serwist.BackgroundSyncQueue`
        - `@serwist/background-sync.QueueStore` -> `serwist.BackgroundSyncQueueStore`

      - `@serwist/broadcast-update`
      - `@serwist/cacheable-response`
      - `@serwist/expiration`
      - `@serwist/google-analytics`

        - `@serwist/google-analytics.initialize` -> `serwist.initializeGoogleAnalytics`

      - `@serwist/range-requests`
      - `@serwist/precaching`
      - `@serwist/routing`
      - `@serwist/strategies`

  - They remain operable for compatibility, but they will be marked as deprecated on npm.

### Patch Changes

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

### Major Changes

- e4c00af: refactor(core): replaced `PrecacheController` and `Router` with `Serwist`

  - `PrecacheController` and `Router` have been moved to `serwist/legacy`. Their functionalities have been merged into the `Serwist` class.
  - The new `Serwist` class does NOT have a singleton instance. As such, `serwist/plugins.initializeGoogleAnalytics()` and `@serwist/recipes`'s functions now require you to pass in your own `Serwist` instance.
  - This was done because separating Serwist's functionalities into three separate classes, namely `PrecacheController`, `Router`, and `Serwist`, was not only unnecessary, but it also required the code to be rather... boilerplatey. In the past, to set up, you needed to install all the necessary packages (`workbox-routing`, `workbox-precaching`, `workbox-strategies`), import all the necessary classes (`PrecacheController`, `Router`,...), and know all the APIs needed (`PrecacheController.precache`, `Router.registerRoute`, `new PrecacheRoute()`, runtime caching strategies,...) to get yourself started. To simplify that whole process, the Workbox team provided GenerateSW, which allowed you to create a service worker without having to write one. However, this design was not my cup of tea, one of the reasons of which was that you needed to migrate from GenerateSW to InjectManifest if you needed to do anything remotely complex, so I replaced it with `installSerwist`. Still, I was not satisfied by the result. I wanted an API where things are simple enough that you don't need to have multiple ways of doing one same thing, some more straightforward than others. This change where we merge the three classes is an effort to simplify and unify the API.
  - To migrate, either:

    - Use the new `Serwist` class:

    ```ts
    import { Serwist } from "serwist";

    const serwist = new Serwist({
      // Initial list of precache entries.
      precacheEntries: [],
      // Initial list of runtime caching strategies.
      runtimeCaching: [],
    });

    // Additionally append another list of precache entries.
    // Make sure there are no duplicates in the initial list.
    serwist.addToPrecacheList([]);

    // Register another runtime caching strategy.
    serwist.registerRoute(new Route(/\/api\/.*\/*.json/, new NetworkOnly(), "POST"));

    // This should be called before `Serwist.addEventListeners`.
    self.addEventListener("message", (event) => {
      if (event.data && event.data.type === "YOUR_MESSAGE_TYPE") {
        // Do something
      }
    });

    // Finally, add Serwist's listeners.
    serwist.addEventListeners();
    ```

    - Or import `PrecacheController` and `Router` from `serwist/legacy`:

    ```ts
    import { PrecacheController, Router } from "serwist/legacy";
    ```

### Patch Changes

- Updated dependencies [e4c00af]
  - serwist@9.0.0-preview.24

## 9.0.0-preview.23

### Patch Changes

- @serwist/sw@9.0.0-preview.23

## 9.0.0-preview.22

### Patch Changes

- @serwist/sw@9.0.0-preview.22

## 9.0.0-preview.21

### Patch Changes

- @serwist/sw@9.0.0-preview.21

## 9.0.0-preview.20

### Patch Changes

- Updated dependencies [10c9394]
  - @serwist/sw@9.0.0-preview.20

## 9.0.0-preview.19

### Patch Changes

- 6d294f9: refactor: migrate to GitLab

  - Serwist and `@ducanh2912/next-pwa` have migrated to GitLab.
  - This was the result of GitHub flagging my account, organizations, and repositories as spam. Sorry for the inconvenience.

- Updated dependencies [6d294f9]
  - @serwist/sw@9.0.0-preview.19

## 9.0.0-preview.18

### Minor Changes

- [`c65578b`](https://github.com/serwist/serwist/commit/c65578b68f1ae88822238c3c03aa5e859a4f2b7e) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor: merge service worker modules into `@serwist/sw`

  - These service worker modules have been merged into `@serwist/sw`:
    - Modules now located at `@serwist/sw/plugins`:
      - `@serwist/background-sync`
      - `@serwist/broadcast-update`
      - `@serwist/cacheable-response`
      - `@serwist/expiration`
      - `@serwist/google-analytics`
      - `@serwist/range-requests`
    - Modules now located at `@serwist/sw/precaching`:
      - `@serwist/precaching`:
        - Excluding `PrecacheFallbackPlugin`, `PrecacheFallbackEntry`, and `PrecacheFallbackPluginOptions`, which are now at `@serwist/sw/plugins`.
    - Modules now located at `@serwist/sw/routing`:
      - `@serwist/routing`
    - Modules now located at `@serwist/sw/strategies`:
      - `@serwist/strategies`
  - They remain operable for compatibility, but they will be marked as deprecated on npm.

### Patch Changes

- Updated dependencies [[`c65578b`](https://github.com/serwist/serwist/commit/c65578b68f1ae88822238c3c03aa5e859a4f2b7e)]:
  - @serwist/sw@9.0.0-preview.18
  - @serwist/core@9.0.0-preview.18

## 9.0.0-preview.17

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.17
  - @serwist/core@9.0.0-preview.17
  - @serwist/routing@9.0.0-preview.17
  - @serwist/strategies@9.0.0-preview.17

## 9.0.0-preview.16

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.16
  - @serwist/core@9.0.0-preview.16
  - @serwist/routing@9.0.0-preview.16
  - @serwist/strategies@9.0.0-preview.16

## 9.0.0-preview.15

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.15
  - @serwist/core@9.0.0-preview.15
  - @serwist/routing@9.0.0-preview.15
  - @serwist/strategies@9.0.0-preview.15

## 9.0.0-preview.14

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.14
  - @serwist/core@9.0.0-preview.14
  - @serwist/routing@9.0.0-preview.14
  - @serwist/strategies@9.0.0-preview.14

## 9.0.0-preview.13

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.13
  - @serwist/core@9.0.0-preview.13
  - @serwist/routing@9.0.0-preview.13
  - @serwist/strategies@9.0.0-preview.13

## 9.0.0-preview.12

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.12
  - @serwist/core@9.0.0-preview.12
  - @serwist/routing@9.0.0-preview.12
  - @serwist/strategies@9.0.0-preview.12

## 9.0.0-preview.11

### Major Changes

- [`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor: use iterables

  - Serwist now uses iterables in its code. For instance, `Headers.prototype.entries()` can be noticed at parts of `@serwist/cacheable-response`.
  - This is partly thanks to our Node.js requirement being bumped to 18.0.0. Iterables have been supported in all major browsers for ages, so they wouldn't be a problem (hell, all browsers that support service workers have support for iterables).
  - Still, since this requires us to enforce the use of Node.js 18.0.0 or later, it is marked a breaking change.

### Patch Changes

- Updated dependencies [[`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063)]:
  - @serwist/background-sync@9.0.0-preview.11
  - @serwist/strategies@9.0.0-preview.11
  - @serwist/routing@9.0.0-preview.11
  - @serwist/core@9.0.0-preview.11

## 9.0.0-preview.10

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.10
  - @serwist/core@9.0.0-preview.10
  - @serwist/routing@9.0.0-preview.10
  - @serwist/strategies@9.0.0-preview.10

## 9.0.0-preview.9

### Patch Changes

- Updated dependencies [[`7e42ad9`](https://github.com/serwist/serwist/commit/7e42ad912d96fdda160a7aad9a5548e7c046bc27)]:
  - @serwist/strategies@9.0.0-preview.9
  - @serwist/background-sync@9.0.0-preview.9
  - @serwist/core@9.0.0-preview.9
  - @serwist/routing@9.0.0-preview.9

## 9.0.0-preview.8

### Major Changes

- [`b1df273`](https://github.com/serwist/serwist/commit/b1df273379ee018fd850f962345740874c9fd54d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(core): allow non-Promise return types for `SerwistPlugin` callbacks

  - Usually you don't need to do anything to migrate, but we still mark it as a breaking change because changing a function's signature is considered a breaking one in this project.

### Patch Changes

- Updated dependencies [[`b1df273`](https://github.com/serwist/serwist/commit/b1df273379ee018fd850f962345740874c9fd54d)]:
  - @serwist/background-sync@9.0.0-preview.8
  - @serwist/strategies@9.0.0-preview.8
  - @serwist/routing@9.0.0-preview.8
  - @serwist/core@9.0.0-preview.8

## 9.0.0-preview.7

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.7
  - @serwist/core@9.0.0-preview.7
  - @serwist/routing@9.0.0-preview.7
  - @serwist/strategies@9.0.0-preview.7

## 9.0.0-preview.6

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.6
  - @serwist/core@9.0.0-preview.6
  - @serwist/routing@9.0.0-preview.6
  - @serwist/strategies@9.0.0-preview.6

## 9.0.0-preview.5

### Major Changes

- [`dc12dda`](https://github.com/serwist/serwist/commit/dc12ddad60526db921b557f8dc5808ba17fc4d8e) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(google-analytics): migrated to the singleton Router instance

  - We now use `@serwist/routing.registerRoute`, rather than `@serwist/routing.Router` like in the past, for `initialize`.

  - You don't need to do anything to migrate.

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.5
  - @serwist/core@9.0.0-preview.5
  - @serwist/routing@9.0.0-preview.5
  - @serwist/strategies@9.0.0-preview.5

## 9.0.0-preview.4

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.4
  - @serwist/core@9.0.0-preview.4
  - @serwist/routing@9.0.0-preview.4
  - @serwist/strategies@9.0.0-preview.4

## 9.0.0-preview.3

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.3
  - @serwist/core@9.0.0-preview.3
  - @serwist/routing@9.0.0-preview.3
  - @serwist/strategies@9.0.0-preview.3

## 9.0.0-preview.2

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.2
  - @serwist/core@9.0.0-preview.2
  - @serwist/routing@9.0.0-preview.2
  - @serwist/strategies@9.0.0-preview.2

## 9.0.0-preview.1

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.1
  - @serwist/core@9.0.0-preview.1
  - @serwist/routing@9.0.0-preview.1
  - @serwist/strategies@9.0.0-preview.1

## 9.0.0-preview.0

### Major Changes

- [`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(js): migrate to ESM-only

  - Serwist is now an ESM-only project.
  - This was done because our tooling around supporting CJS had always been crappy: it was slow, had no way of supporting emitting `.d.cts` (we used to copy `.d.ts` to `.d.cts`), and was too error-prone (there were various issues of our builds crashing due to an ESM-only package slipping in).
  - If you already use ESM, there's nothing to be done. Great! Otherwise, to migrate:

    - Migrate to ESM if possible.
    - Otherwise, use dynamic imports. For example, to migrate to the new `@serwist/next`:

      - Old:

      ```js
      // @ts-check
      const withSerwist = require("@serwist/next").default({
        cacheOnNavigation: true,
        swSrc: "app/sw.ts",
        swDest: "public/sw.js",
      });
      /** @type {import("next").NextConfig} */
      const nextConfig = {
        reactStrictMode: true,
      };

      module.exports = withSerwist(nextConfig);
      ```

      - New:

      ```js
      // @ts-check
      /** @type {import("next").NextConfig} */
      const nextConfig = {
        reactStrictMode: true,
      };

      module.exports = async () => {
        const withSerwist = (await import("@serwist/next")).default({
          cacheOnNavigation: true,
          swSrc: "app/sw.ts",
          swDest: "public/sw.js",
        });
        return withSerwist(nextConfig);
      };
      ```

  - I know that most of our current userbase use Next.js, which still suggests using a CJS config file, so I am really sorry for the trouble I have caused for you :( However, what needs to be done has to be done. It was time to migrate and get rid of old, legacy things.

### Patch Changes

- Updated dependencies [[`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58), [`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459)]:
  - @serwist/routing@9.0.0-preview.0
  - @serwist/core@9.0.0-preview.0
  - @serwist/background-sync@9.0.0-preview.0
  - @serwist/strategies@9.0.0-preview.0

## 8.4.4

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.4.4
  - @serwist/core@8.4.4
  - @serwist/routing@8.4.4
  - @serwist/strategies@8.4.4

## 8.4.3

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.4.3
  - @serwist/core@8.4.3
  - @serwist/routing@8.4.3
  - @serwist/strategies@8.4.3

## 8.4.2

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.4.2
  - @serwist/core@8.4.2
  - @serwist/routing@8.4.2
  - @serwist/strategies@8.4.2

## 8.4.1

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.4.1
  - @serwist/core@8.4.1
  - @serwist/routing@8.4.1
  - @serwist/strategies@8.4.1

## 8.4.0

### Patch Changes

- [#32](https://github.com/serwist/serwist/pull/32) [`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(docs): changed docs's URL

  - Currently we deploy at Cloudflare Pages.

- Updated dependencies [[`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d)]:
  - @serwist/background-sync@8.4.0
  - @serwist/strategies@8.4.0
  - @serwist/routing@8.4.0
  - @serwist/core@8.4.0

## 8.3.0

### Patch Changes

- Updated dependencies [[`bd75087`](https://github.com/serwist/serwist/commit/bd7508722a50bc2191d24a1e6e55a835060ba350)]:
  - @serwist/core@8.3.0
  - @serwist/background-sync@8.3.0
  - @serwist/routing@8.3.0
  - @serwist/strategies@8.3.0

## 8.2.0

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.2.0
  - @serwist/core@8.2.0
  - @serwist/routing@8.2.0
  - @serwist/strategies@8.2.0

## 8.1.1

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.1.1
  - @serwist/core@8.1.1
  - @serwist/routing@8.1.1
  - @serwist/strategies@8.1.1

## 8.1.0

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.1.0
  - @serwist/core@8.1.0
  - @serwist/routing@8.1.0
  - @serwist/strategies@8.1.0

## 8.0.5

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.0.5
  - @serwist/core@8.0.5
  - @serwist/routing@8.0.5
  - @serwist/strategies@8.0.5

## 8.0.4

### Patch Changes

- [#10](https://github.com/serwist/serwist/pull/10) [`52edfe2`](https://github.com/serwist/serwist/commit/52edfe2f9e4ff2007747dd038023dbc94af52698) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(node-16-cjs): added type support for NodeNext with CommonJS

  - The "fix" is really simple - we copy `.d.ts` to `.old.d.cts` 💀
  - This also fixes the issue where using `@serwist/build`, `@serwist/webpack-plugin`, and their dependents with CommonJS crashes due to us using `pretty-bytes`, which is an ESM package.

- Updated dependencies [[`52edfe2`](https://github.com/serwist/serwist/commit/52edfe2f9e4ff2007747dd038023dbc94af52698)]:
  - @serwist/background-sync@8.0.4
  - @serwist/strategies@8.0.4
  - @serwist/routing@8.0.4
  - @serwist/core@8.0.4

## 8.0.3

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.0.3
  - @serwist/core@8.0.3
  - @serwist/routing@8.0.3
  - @serwist/strategies@8.0.3

## 8.0.2

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.0.2
  - @serwist/core@8.0.2
  - @serwist/routing@8.0.2
  - @serwist/strategies@8.0.2

## 8.0.1

### Patch Changes

- [`15fb388`](https://github.com/serwist/serwist/commit/15fb38839a5b3b06bdaa39994fba29b56d05b301) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(publish): removed declarations map

- Updated dependencies [[`15fb388`](https://github.com/serwist/serwist/commit/15fb38839a5b3b06bdaa39994fba29b56d05b301)]:
  - @serwist/background-sync@8.0.1
  - @serwist/core@8.0.1
  - @serwist/routing@8.0.1
  - @serwist/strategies@8.0.1

## 8.0.0

### Major Changes

- [`e0313f0`](https://github.com/serwist/serwist/commit/e0313f02f661a07ccbe9edc64e44e1af6136c73e) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: initial release

  - Reimagined `@serwist/next`.
    - Removed various options.
      - Removed `aggressiveFrontEndNavCaching` to reassess its usefulness.
      - Removed `browserslist`. Use `swcEnvTargets` instead (TODO: add this option).
      - Custom workers have been removed. You should use `swSrc`.
      - Removed `extendDefaultRuntimeCaching`. Use the spread syntax instead (use `import { defaultCache } from "@serwist/next/browser"` to import the default runtimeCaching array).
      - Temporarily removed `fallbacks` to investigate module-friendly alternatives.
      - Removed `swcMinify`.
      - Removed `watchWorkersInDev`.
      - Removed `cacheStartUrl`, `dynamicStartUrl`, and `dynamicStartUrl`. These shall be re-added only when their use cases are made more clear to me.
    - Merged `workboxOptions` with the plugin's options.
    - Removed `swc-loader`, `terser-minify`, `webpack-builders`,... (we now leverage `ChildCompilationPlugin` to compile workers - this change will be backported to `@ducanh2912/next-pwa@10`)
    - Removed the ability to use GenerateSW. `@serwist/sw.installSerwist` is provided as a replacement.
    - `swSrc` is now a required property.
    - Moved minimum support Next.js version from `11.0.0` to `14.0.0`.
  - Removed GenerateSW (replaced by `@serwist/sw.installSerwist`).
    - See `examples/next-basic/app/sw.ts` to see how `installSerwist` should be used.
  - Repurposed `@serwist/sw`.
    - The old package might be reintroduced if there's demand.
  - **Note:** This is just the initial release, and there is still a lot of ground to cover (a lot of legacy code to be removed, a lot of features to be reintroduced,...). Here's to a bright future for the project :\_)

### Patch Changes

- Updated dependencies [[`e0313f0`](https://github.com/serwist/serwist/commit/e0313f02f661a07ccbe9edc64e44e1af6136c73e)]:
  - @serwist/background-sync@8.0.0
  - @serwist/strategies@8.0.0
  - @serwist/routing@8.0.0
  - @serwist/core@8.0.0
