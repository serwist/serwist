---
"@serwist/next": minor
---

feat(next): added `@serwist/next/worker.PAGES_CACHE_NAME`

- Due to the fact that App Router pages use RSC, we define 3 `runtimeCaching` entries in `defaultCache`, which are `"pages-rsc-prefetch"`, `"pages-rsc"`, and `"pages"`. This simply re-exports these `cacheName`'s for the users so that they can use them in their own extensions of our `defaultCache`.

- If you previously copied these values from the source code, it is recommended that you migrate to this constant:

  - Old:

  ```ts
  import { defaultCache } from "@serwist/next/browser";
  import { installSerwist } from "@serwist/sw";

  installSerwist({
    // Other options...
    runtimeCaching: [
      {
        urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
          request.headers.get("RSC") === "1" && request.headers.get("Next-Router-Prefetch") === "1" && sameOrigin && !pathname.startsWith("/api/"),
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
  import { Serwist } from "@serwist/sw";

  const serwist = new Serwist();

  serwist.install({
    // Other options...
    runtimeCaching: [
      {
        matcher: ({ request, url: { pathname }, sameOrigin }) =>
          request.headers.get("RSC") === "1" && request.headers.get("Next-Router-Prefetch") === "1" && sameOrigin && !pathname.startsWith("/api/"),
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
  ```
