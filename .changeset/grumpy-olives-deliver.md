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

refactor: merge service worker modules into `serwist`

- These service worker modules have been merged into `serwist`:

  - Modules now located at `serwist`:

    - `@serwist/navigation-preload`:

      - `@serwist/navigation-preload.disable` -> `serwist.disableNavigationPreload`.

      - `@serwist/navigation-preload.enable` -> `serwist.enableNavigationPreload`.

      - `@serwist/navigation-preload.isSupported` -> `serwist.isNavigationPreloadSupported`.

    - `@serwist/background-sync`

      - `@serwist/background-sync.QueueEntry` -> `serwist.BackgroundSyncQueueEntry`

      - `@serwist/background-sync.QueueOptions` -> `serwist.BackgroundSyncQueueOptions`

      - `@serwist/background-sync.Queue` -> `serwist.BackgroundSyncQueue`

      - `@serwist/background-sync.QueueStore` -> `serwist.BackgroundSyncQueueStore`

    - `@serwist/broadcast-update`

    - `@serwist/cacheable-response`

    - `@serwist/expiration`

    - `@serwist/google-analytics`

      - `@serwist/google-analytics.initialize` -> `serwist.initializeGoogleAnalytics`

    - `@serwist/range-requests`

    - `@serwist/precaching`

    - `@serwist/routing`

    - `@serwist/strategies`

- They remain operable for compatibility, but they will be marked as deprecated on npm.
