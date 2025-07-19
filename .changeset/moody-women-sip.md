---
"@serwist/astro": minor
---

feat(astro): added `@serwist/astro`

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
  import { addEventListeners, createSerwist, RuntimeCache } from "serwist";

  declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
      // Change this attribute's name to your `injectionPoint`.
      // `injectionPoint` is an InjectManifest option.
      // See https://serwist.pages.dev/docs/build/configuring
      __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
  }

  declare const self: ServiceWorkerGlobalScope;

  const serwist = createSerwist({
    precache: {
      entries: self.__SW_MANIFEST,
      cleanupOutdatedCaches: true,
      concurrency: 10,
    },
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    extensions: [new RuntimeCache(defaultCache)],
  });

  addEventListeners(serwist);
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