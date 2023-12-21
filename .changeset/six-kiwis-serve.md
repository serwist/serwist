---
"@serwist/sw": minor
---

feat(sw): added fallbacks

- A removed feature of `@ducanh2912/next-pwa`, renovated.
- There are differences from the old counterpart:

  - This feature belongs to `@serwist/sw`, rather than `@serwist/next`.
  - You are expected to provide a revision key yourself.
  - Go crazy: `matcher` replaces `request.destination` as the way to check whether a fallback entry is fit for a Request.
  - Usage example:

  ```js
  installSerwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
    fallbacks: {
      entries: [
        {
          url: "/~offline",
          revision,
          matcher({ request }) {
            return request.destination === "document";
          },
        },
      ],
    },
  });
  ```
