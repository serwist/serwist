---
"@serwist/react-router": minor
---

feat(react-router): added `@serwist/react-router`

- This module helps developers integrate Serwist into React Router applications. To get started:

  - Install required packages:

  ```bash
  npm i -D @serwist/react-router serwist
  ```

  - Add Vite plugin:

  ```ts
  // vite.config.ts
  import { serwist } from "@serwist/react-router";

  export default defineConfig({
    plugins: [
      reactRouter(),
      // After React Router's Vite plugin
      serwist(),
      tsconfigPaths(),
    ],
  });
  ```

  - Write a service worker!

  ```ts
  import { defaultCache } from "@serwist/react-router/worker";
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

  - Add `@serwist/react-router/typings` to `compilerOptions.types`:

  ```jsonc
  {
    "compilerOptions": {
      "lib": ["DOM", "DOM.Iterable", "ES2022", "WebWorker"],
      "types": ["node", "vite/client", "@serwist/react-router/typings"]
    }
  }
  ```

  - Register your service worker!

  ```tsx
  // app/root.tsx
  import { useSerwist } from "virtual:serwist/react";

  export default function App() {
    const serwist = useSerwist();
    useEffect(() => {
      if (!serwist) return;
      serwist.addEventListener("installed", () => {
        console.log("Serwist installed!");
      });
      void serwist.register();
    }, [serwist]);
    return <Outlet />;
  }
  ```