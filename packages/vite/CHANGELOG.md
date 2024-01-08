# @serwist/vite

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
