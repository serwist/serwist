---
"serwist": major
---

refactor(sw): removed support for string handlers in `registerRuntimeCaching`

- The `runtimeCaching` option of the `Serwist` class and its legacy counterpart `registerRuntimeCaching` no longer support string handlers, such as `"NetworkFirst"`, `"NetworkOnly"`, `"CacheFirst"`, etc. You should migrate to passing the strategies' instances yourself:

- By supporting this, a relic of GenerateSW, we are simply adding unwarranted complexity to the codebase.

- Usually, if you only use the `defaultCache` array from a Serwist framework integration, you don't need to do anything. Otherwise, to migrate:

  - Old:

  ```ts
  import { defaultCache } from "@serwist/next/worker";
  import { installSerwist } from "@serwist/sw";

  installSerwist({
    // Other options...
    runtimeCaching: [
      {
        urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
          request.headers.get("RSC") === "1" && request.headers.get("Next-Router-Prefetch") === "1" && sameOrigin && !pathname.startsWith("/api/"),
        // OLD: a string handler alongside `options`.
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-rsc-prefetch",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: ({ request, url: { pathname }, sameOrigin }) => request.headers.get("RSC") === "1" && sameOrigin && !pathname.startsWith("/api/"),
        // OLD: a string handler alongside `options`.
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-rsc",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      {
        urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
          request.headers.get("Content-Type")?.includes("text/html") && sameOrigin && !pathname.startsWith("/api/"),
        // OLD: a string handler alongside `options`.
        handler: "NetworkFirst",
        options: {
          cacheName: "pages",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
      ...defaultCache,
    ],
  });
  ```

  - New:

  ```ts
  import { defaultCache, PAGES_CACHE_NAME } from "@serwist/next/worker";
  import { Serwist } from "serwist";

  const serwist = new Serwist({
    // Other options...
    runtimeCaching: [
      {
        matcher: ({ request, url: { pathname }, sameOrigin }) =>
          request.headers.get("RSC") === "1" && request.headers.get("Next-Router-Prefetch") === "1" && sameOrigin && !pathname.startsWith("/api/"),
        // NEW: an initialized instance.
        handler: new NetworkFirst({
          cacheName: PAGES_CACHE_NAME.rscPrefetch,
          plugins: [
            new ExpirationPlugin({
              maxEntries: 32,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
            }),
          ],
        }),
      },
      {
        matcher: ({ request, url: { pathname }, sameOrigin }) => request.headers.get("RSC") === "1" && sameOrigin && !pathname.startsWith("/api/"),
        // NEW: an initialized instance.
        handler: new NetworkFirst({
          cacheName: PAGES_CACHE_NAME.rsc,
          plugins: [
            new ExpirationPlugin({
              maxEntries: 32,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
            }),
          ],
        }),
      },
      {
        matcher: ({ request, url: { pathname }, sameOrigin }) =>
          request.headers.get("Content-Type")?.includes("text/html") && sameOrigin && !pathname.startsWith("/api/"),
        // NEW: an initialized instance.
        handler: new NetworkFirst({
          cacheName: PAGES_CACHE_NAME.html,
          plugins: [
            new ExpirationPlugin({
              maxEntries: 32,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
            }),
          ],
        }),
      },
      ...defaultCache,
    ],
  });

  serwist.addEventListeners();
  ```
