# @serwist/vite

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
