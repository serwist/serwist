---
"@serwist/turbopack": minor
---

feat(turbo): export `useSerwist` & added `cacheOnNavigation`

- This allows retrieving the global `@serwist/window` instance without accessing the `window` object, which makes typing `window.serwist` unnecessary. Both ways of accessing the instance remain supported.

- `cacheOnNavigation` is a feature of `@serwist/next` that has been ported to `@serwist/turbopack`. It is enabled by default. The service worker must accept `{ type: "CACHE_URLS", payload: { urlsToCache: string[] }}` messages for this feature to work.