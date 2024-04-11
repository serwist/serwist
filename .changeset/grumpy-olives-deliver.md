---
"@serwist/cacheable-response": minor
"@serwist/broadcast-update": minor
"@serwist/google-analytics": minor
"@serwist/background-sync": minor
"@serwist/range-requests": minor
"@serwist/expiration": minor
"@serwist/precaching": minor
"@serwist/strategies": minor
"@serwist/routing": minor
"serwist": minor
---

refactor: merge service worker modules into `@serwist/sw`

- These service worker modules have been merged into `@serwist/sw`:

  - Modules now located at `@serwist/sw`:

    - `@serwist/navigation-preload`:

      - `@serwist/navigation-preload.disable` -> `@serwist/sw.disableNavigationPreload`.

      - `@serwist/navigation-preload.enable` -> `@serwist/sw.enableNavigationPreload`.

      - `@serwist/navigation-preload.isSupported` -> `@serwist/sw.isNavigationPreloadSupported`.

  - Modules now located at `@serwist/sw/plugins`:

    - `@serwist/background-sync`

      - `@serwist/background-sync.QueueEntry` -> `@serwist/sw/plugins.BackgroundSyncQueueEntry`

      - `@serwist/background-sync.QueueOptions` -> `@serwist/sw/plugins.BackgroundSyncQueueOptions`

      - `@serwist/background-sync.Queue` -> `@serwist/sw/plugins.BackgroundSyncQueue`

      - `@serwist/background-sync.QueueStore` -> `@serwist/sw/plugins.BackgroundSyncQueueStore`

    - `@serwist/broadcast-update`

      - `@serwist/broadcast-update.CACHE_UPDATED_MESSAGE_META` -> `@serwist/sw/plugins.BROADCAST_UPDATE_MESSAGE_META`

      - `@serwist/broadcast-update.BROADCAST_UPDATE_MESSAGE_TYPE` -> `@serwist/sw/plugins.BROADCAST_UPDATE_MESSAGE_TYPE`

      - `@serwist/broadcast-update.defaultHeadersToCheck` -> `@serwist/sw.BROADCAST_UPDATE_DEFAULT_HEADERS`

    - `@serwist/cacheable-response`

    - `@serwist/expiration`

    - `@serwist/google-analytics`

      - `@serwist/google-analytics.initialize` -> `@serwist/sw/plugins.initializeGoogleAnalytics`

    - `@serwist/range-requests`

  - Modules now located at `@serwist/sw/precaching`:

    - `@serwist/precaching`:

      - Excluding `PrecacheFallbackPlugin`, `PrecacheFallbackEntry`, and `PrecacheFallbackPluginOptions`, which are now at `@serwist/sw/plugins`.

  - Modules now located at `@serwist/sw/routing`:

    - `@serwist/routing`

  - Modules now located at `@serwist/sw/strategies`:

    - `@serwist/strategies`

- They remain operable for compatibility, but they will be marked as deprecated on npm.
