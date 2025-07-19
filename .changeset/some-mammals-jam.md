---
"serwist": minor
---

feat(core): added extensions & deprecate the `Serwist` class

- This allows users to extend Serwist with ease.

- With this change, the `Serwist` class has been deprecated. It is now replaced with `createSerwist`, which has the following syntax:

```ts
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { addEventListeners, createSerwist, RuntimeCache } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = createSerwist({
  precache: {
    entries: self.__SW_MANIFEST,
    concurrency: 20,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  extensions: [
    new RuntimeCache(defaultCache, {
      warmEntries: ["/~offline"],
      fallbacks: {
        entries: [
          {
            url: "/~offline",
            matcher({ request }) {
              return request.destination === "document";
            },
          },
        ],
      },
    }),
  ],
});

addEventListeners(serwist);
```

This new syntax is only slightly different, but it saves quite a bit of bundle size and maintenance burden. All methods of the `Serwist` class can be imported from the `serwist` module with this syntax. If you have the time, definitely do migrate!

Note that extensions also support the `Serwist` class, so you can add any extension to its instances too.