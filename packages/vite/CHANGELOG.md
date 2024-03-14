# @serwist/vite

## 9.0.0-preview.14

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.14
  - @serwist/expiration@9.0.0-preview.14
  - @serwist/strategies@9.0.0-preview.14
  - @serwist/sw@9.0.0-preview.14
  - @serwist/window@9.0.0-preview.14

## 9.0.0-preview.13

### Major Changes

- [`add4fdd`](https://github.com/serwist/serwist/commit/add4fdd390555053d023faebfe1dca41510b2e2f) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(build): moved framework-specific types out of `@serwist/build`

  - Types the likes of `WebpackPartial`, `WebpackInjectManifestOptions`, `ViteInjectManifestOptions`, along with their according validators have been moved out of `@serwist/build`.
  - This design, a relic of Workbox, never made any sense in the first place. As such, we are getting rid of it and migrating to a design where types and validators are co-located with their related packages.
  - To migrate, update the imports:

    - `@serwist/build.WebpackPartial` -> `@serwist/webpack-plugin.WebpackPartial`
    - `@serwist/build.WebpackInjectManifestOptions` -> `@serwist/webpack-plugin.InjectManifestOptions`
    - `@serwist/build.WebpackInjectManifestPartial` -> `Omit<import("@serwist/webpack-plugin").InjectManifestOptions, keyof import("@serwist/build").BasePartial | keyof import("@serwist/build").InjectPartial | keyof import("@serwist/webpack-plugin").WebpackPartial | keyof import("@serwist/build").OptionalSwDestPartial>`
    - `@serwist/build.ViteInjectManifestOptions` -> `@serwist/vite.PluginOptions`

  - With this change, validators and schemas have also been made public. Validators can be imported from "/" files, whereas schemas can be imported from "/schema" ones.

### Patch Changes

- Updated dependencies [[`add4fdd`](https://github.com/serwist/serwist/commit/add4fdd390555053d023faebfe1dca41510b2e2f)]:
  - @serwist/build@9.0.0-preview.13
  - @serwist/expiration@9.0.0-preview.13
  - @serwist/strategies@9.0.0-preview.13
  - @serwist/sw@9.0.0-preview.13
  - @serwist/window@9.0.0-preview.13

## 9.0.0-preview.12

### Patch Changes

- Updated dependencies [[`b273b8c`](https://github.com/serwist/serwist/commit/b273b8cd9a240f8bf8ba357339e2e2d5dc2e8870)]:
  - @serwist/sw@9.0.0-preview.12
  - @serwist/build@9.0.0-preview.12
  - @serwist/expiration@9.0.0-preview.12
  - @serwist/strategies@9.0.0-preview.12
  - @serwist/window@9.0.0-preview.12

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
  - @serwist/window@9.0.0-preview.11
  - @serwist/build@9.0.0-preview.11
  - @serwist/sw@9.0.0-preview.11

## 9.0.0-preview.10

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.10
  - @serwist/expiration@9.0.0-preview.10
  - @serwist/strategies@9.0.0-preview.10
  - @serwist/sw@9.0.0-preview.10
  - @serwist/window@9.0.0-preview.10

## 9.0.0-preview.9

### Patch Changes

- Updated dependencies [[`7e42ad9`](https://github.com/serwist/serwist/commit/7e42ad912d96fdda160a7aad9a5548e7c046bc27)]:
  - @serwist/strategies@9.0.0-preview.9
  - @serwist/sw@9.0.0-preview.9
  - @serwist/build@9.0.0-preview.9
  - @serwist/expiration@9.0.0-preview.9
  - @serwist/window@9.0.0-preview.9

## 9.0.0-preview.8

### Patch Changes

- Updated dependencies [[`b1df273`](https://github.com/serwist/serwist/commit/b1df273379ee018fd850f962345740874c9fd54d)]:
  - @serwist/expiration@9.0.0-preview.8
  - @serwist/strategies@9.0.0-preview.8
  - @serwist/build@9.0.0-preview.8
  - @serwist/sw@9.0.0-preview.8
  - @serwist/window@9.0.0-preview.8

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
  - @serwist/build@9.0.0-preview.7
  - @serwist/expiration@9.0.0-preview.7
  - @serwist/strategies@9.0.0-preview.7
  - @serwist/sw@9.0.0-preview.7
  - @serwist/window@9.0.0-preview.7

## 9.0.0-preview.6

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.6
  - @serwist/sw@9.0.0-preview.6
  - @serwist/expiration@9.0.0-preview.6
  - @serwist/strategies@9.0.0-preview.6
  - @serwist/window@9.0.0-preview.6

## 9.0.0-preview.5

### Patch Changes

- Updated dependencies [[`dc12dda`](https://github.com/serwist/serwist/commit/dc12ddad60526db921b557f8dc5808ba17fc4d8e)]:
  - @serwist/sw@9.0.0-preview.5
  - @serwist/build@9.0.0-preview.5
  - @serwist/expiration@9.0.0-preview.5
  - @serwist/strategies@9.0.0-preview.5
  - @serwist/window@9.0.0-preview.5

## 9.0.0-preview.4

### Patch Changes

- Updated dependencies [[`6c3e789`](https://github.com/serwist/serwist/commit/6c3e789724533dab23a6f5afb2a0f40d8f26bf16)]:
  - @serwist/sw@9.0.0-preview.4
  - @serwist/build@9.0.0-preview.4
  - @serwist/expiration@9.0.0-preview.4
  - @serwist/strategies@9.0.0-preview.4
  - @serwist/window@9.0.0-preview.4

## 9.0.0-preview.3

### Patch Changes

- Updated dependencies [[`10c3c17`](https://github.com/serwist/serwist/commit/10c3c17a0021c87886c47c2588d8beca1cb21535)]:
  - @serwist/sw@9.0.0-preview.3
  - @serwist/build@9.0.0-preview.3
  - @serwist/expiration@9.0.0-preview.3
  - @serwist/strategies@9.0.0-preview.3
  - @serwist/window@9.0.0-preview.3

## 9.0.0-preview.2

### Patch Changes

- Updated dependencies [[`85bc781`](https://github.com/serwist/serwist/commit/85bc7812ed38f52bb04bbc79333950beafa75e42)]:
  - @serwist/sw@9.0.0-preview.2
  - @serwist/build@9.0.0-preview.2
  - @serwist/window@9.0.0-preview.2

## 9.0.0-preview.1

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.1
  - @serwist/sw@9.0.0-preview.1
  - @serwist/window@9.0.0-preview.1

## 9.0.0-preview.0

### Major Changes

- [`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(peerDeps): bump minimum supported TypeScript and Node.js version

  - From now, we only support TypeScript versions later than 5.0.0 and Node.js ones later than 18.0.0.
  - To migrate, simply update these tools.

  ```bash
  # Change to your preferred way of updating Node.js
  nvm use 18
  # Change to your package manager
  npm i -D typescript@5
  ```

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

- Updated dependencies [[`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459), [`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58), [`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459), [`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58), [`04d2619`](https://github.com/serwist/serwist/commit/04d26194b19936ba0425bf7b7e6c5e2ca9183813)]:
  - @serwist/build@9.0.0-preview.0
  - @serwist/sw@9.0.0-preview.0
  - @serwist/window@9.0.0-preview.0

## 8.4.4

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.4.4
  - @serwist/window@8.4.4

## 8.4.3

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.4.3
  - @serwist/window@8.4.3

## 8.4.2

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.4.2
  - @serwist/window@8.4.2

## 8.4.1

### Patch Changes

- Updated dependencies [[`d45c7a3`](https://github.com/serwist/serwist/commit/d45c7a3e62cd98eab3110038f3f90240bd5e6831)]:
  - @serwist/build@8.4.1
  - @serwist/window@8.4.1

## 8.4.0

### Minor Changes

- [#32](https://github.com/serwist/serwist/pull/32) [`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(vite): disintegrate `@serwist/vite` from `@serwist/build`

  - What this means is that we don't use `@serwist/build.injectManifest` anymore. Using `define` just works™️
  - The benefit of owning the entire codebase... :D

### Patch Changes

- [#32](https://github.com/serwist/serwist/pull/32) [`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(docs): changed docs's URL

  - Currently we deploy at Cloudflare Pages.

- Updated dependencies [[`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d)]:
  - @serwist/window@8.4.0
  - @serwist/build@8.4.0

## 8.3.0

### Minor Changes

- [`d368225`](https://github.com/serwist/serwist/commit/d368225e7b0aea842b6f7b8ea71ebe93b2516179) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(vite): support development mode

  - This is a bit different to how `vite-plugin-pwa` does it. In dev, the plugin handles the service worker in two ways:
    - If `devOptions.bundle` is enabled, hook a middleware that bundles the service worker through `api.generateSW()` and returns the result into Vite's dev server.
    - Otherwise, run `injectManifest` and return the service worker through `async load(id)`. Although `precacheEntries` is always `undefined`, we still do this to check the user's `injectManifest` options in dev mode.

### Patch Changes

- [`bd75087`](https://github.com/serwist/serwist/commit/bd7508722a50bc2191d24a1e6e55a835060ba350) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(cjs): fixed CommonJS builds crashing

  - Turns out we also need `chunkFileNames`, otherwise Rollup would always use ".js" for all the chunks. What in the world.

- Updated dependencies [[`0bb9635`](https://github.com/serwist/serwist/commit/0bb96358f7574b80fac060b0d8208528f8d92ff8)]:
  - @serwist/window@8.3.0
  - @serwist/build@8.3.0

## 8.2.0

### Minor Changes

- [`b80b988`](https://github.com/serwist/serwist/commit/b80b988ca0b248131776b3e4b0e313715961c444) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(vite): added `@serwist/vite`

  - This is a fork of `vite-plugin-pwa`, but it has undergone a major refactor so as to meet our use case. One can notice the obvious lack of features in comparison to `vite-plugin-pwa`.
  - At the moment, only base Vite and SvelteKit are supported. Some other frameworks, such as Astro, Nuxt, and Solid.js, will be added soon.
  - Currently, `@serwist/vite` and its SvelteKit integration do not support development mode. This is because of two reasons:
    - `vite-plugin-pwa`'s way of support dev was... seemingly unnecessarily bloated in my opinion. I hold the belief that having a separate "dev-sw.js" is not the way to go. Rather, I want to directly bundle `swSrc`. It's just that I've not figured out a way to do so. If that's not possible, perhaps we can consider their way of doing it again.
    - [Many browsers still do not support using ESM in service workers](https://caniuse.com/mdn-api_serviceworker_ecmascript_modules), causing them to fail to parse SvelteKit's dev "service-worker.ts".
  - To get started:

    - Normal Vite:

    ```ts
    // src/sw.ts
    import type { PrecacheEntry } from "@serwist/precaching";
    import { installSerwist } from "@serwist/sw";
    import { defaultCache } from "@serwist/vite/worker";

    declare const self: ServiceWorkerGlobalScope & {
      // Change this attribute's name to your `injectionPoint`.
      __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    };

    installSerwist({
      precacheEntries: self.__SW_MANIFEST,
      skipWaiting: true,
      clientsClaim: true,
      navigationPreload: true,
      runtimeCaching: defaultCache,
    });

    // vite.config.{ts,js}
    import { serwist } from "@serwist/vite";
    import { defineConfig } from "vite";

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [
        // other plugins...
        serwist({
          swSrc: "src/sw.ts",
          swDest: "sw.js",
          globDirectory: "dist",
          injectionPoint: "self.__SW_MANIFEST",
          rollupFormat: "iife",
        }),
      ],
    });

    // App.ts
    const registerSerwist = async () => {
      // dev mode is not supported at the moment.
      if (import.meta.env.DEV) return;
      const serwist = await getSerwist();
      if (serwist) {
        serwist.addEventListener("installed", () =>
          console.log("Serwist installed!"),
        );
        await serwist.register();
      }
    };
    registerSerwist();
    ```

    - SvelteKit:

    ```ts
    // src/service-worker.ts
    /// <reference no-default-lib="true"/>
    /// <reference lib="esnext" />
    /// <reference lib="webworker" />
    /// <reference types="@sveltejs/kit" />
    import type { PrecacheEntry } from "@serwist/precaching";
    import { installSerwist } from "@serwist/sw";
    import { defaultCache } from "@serwist/vite/worker";

    declare const self: ServiceWorkerGlobalScope & {
      // Change this attribute's name to your `injectionPoint`.
      __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    };

    installSerwist({
      precacheEntries: self.__SW_MANIFEST,
      skipWaiting: true,
      clientsClaim: true,
      navigationPreload: true,
      runtimeCaching: defaultCache,
    });

    // vite.config.{ts,js}
    import { serwist } from "@serwist/vite/integration-svelte";
    import { sveltekit } from "@sveltejs/kit/vite";
    import { defineConfig } from "vite";

    export default defineConfig({
      plugins: [
        sveltekit(),
        serwist({
          // dev mode is not supported at the moment.
          disable: process.env.NODE_ENV === "development",
        }),
      ],
    });

    // +layout.svelte
    $effect(() => {
      const registerSerwist = async () => {
        // dev mode is not supported at the moment.
        if (import.meta.env.DEV) return;
        const serwist = await getSerwist();
        if (serwist) {
          serwist.addEventListener("installed", () =>
            console.log("Serwist installed!"),
          );
          await serwist.register();
        }
      };
      registerSerwist();
    });
    ```

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.2.0
  - @serwist/window@8.2.0
