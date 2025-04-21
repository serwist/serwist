# @serwist/astro

## 10.0.0-preview.8
### Patch Changes

- Updated dependencies [[`6cec717`](https://github.com/serwist/serwist/commit/6cec7175feb06ea2594b571914466bb1c38bf5d3)]:
  - vite-plugin-serwist@10.0.0-preview.8
  - @serwist/build@10.0.0-preview.8
  - @serwist/utils@10.0.0-preview.8
  - @serwist/window@10.0.0-preview.8

## 10.0.0-preview.7
### Minor Changes



- [`f77e1b2`](https://github.com/serwist/serwist/commit/f77e1b2bdc53f8b46b2e231e0151b237da3446ec) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(astro): added `@serwist/astro`
  
  - This module helps developers integrate Serwist into Astro applications. To get started:
  
    - Install required packages:
  
    ```bash
    npm i -D @serwist/astro serwist
    ```
  
    - Add Vite plugin:
  
    ```ts
    // astro.config.mjs
    // @ts-check
    import { serwist } from "@serwist/astro";
  
    export default defineConfig({
      integrations: [serwist()],
    });
    ```
  
    - Write a service worker!
  
    ```ts
    /// <reference no-default-lib="true" />
    /// <reference lib="esnext" />
    /// <reference lib="webworker" />
    import { defaultCache } from "@serwist/astro/worker";
    import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
    import { RuntimeCacheController, Serwist } from "serwist";
  
    declare global {
      interface WorkerGlobalScope extends SerwistGlobalConfig {
        // Change this attribute's name to your `injectionPoint`.
        // `injectionPoint` is an InjectManifest option.
        // See https://serwist.pages.dev/docs/build/configuring
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
      }
    }
  
    declare const self: ServiceWorkerGlobalScope;
  
    const serwist = new Serwist({
      precacheEntries: self.__SW_MANIFEST,
      precacheOptions: {
        cleanupOutdatedCaches: true,
        concurrency: 10,
      },
      controllers: [new RuntimeCacheController(defaultCache)],
      skipWaiting: true,
      clientsClaim: true,
      navigationPreload: true,
    });
  
    serwist.addEventListeners();
    ```
  
    - Add `@serwist/astro/typings` to `compilerOptions.types`:
  
    ```jsonc
    {
      "extends": "astro/tsconfigs/strict",
      "compilerOptions": {
        "types": ["node", "@serwist/astro/typings"]
      },
      "include": [".astro/types.d.ts", "**/*"],
      "exclude": ["dist"]
    }
    ```
  
    - Register your service worker!
  
    ```ts
    // src/layouts/serwist.ts
    import { swUrl, swScope, swType } from "virtual:serwist";
    import { Serwist } from "@serwist/window";
  
    const serwist = new Serwist(swUrl, { scope: swScope, type: swType });
  
    serwist.addEventListener("installed", () => {
      console.log("Serwist installed!");
    });
  
    void serwist.register();
    ```
  
    ```astro
    <!doctype html>
    <html lang="en">
    	<head>
        <!-- Other stuff... -->
    		<script src="./serwist.ts" />
    	</head>
    	<body>
    		<slot />
    	</body>
    </html>
    ```

### Patch Changes

- Updated dependencies [[`f77e1b2`](https://github.com/serwist/serwist/commit/f77e1b2bdc53f8b46b2e231e0151b237da3446ec), [`580db86`](https://github.com/serwist/serwist/commit/580db86b7f5616ba05a89970e8ce83791f920340), [`f77e1b2`](https://github.com/serwist/serwist/commit/f77e1b2bdc53f8b46b2e231e0151b237da3446ec)]:
  - vite-plugin-serwist@10.0.0-preview.7
  - @serwist/window@10.0.0-preview.7
  - @serwist/build@10.0.0-preview.7
  - @serwist/utils@10.0.0-preview.7
