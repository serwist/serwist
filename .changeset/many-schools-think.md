---
"@serwist/precaching": major
"@serwist/sw": major
---

feat(precaching.PrecacheFallbackPlugin): renamed `fallbackURL`, added support for a `matcher`

- `fallbackURL` has been renamed to `fallbackUrls`, which should now be an array of strings or `PrecacheFallbackEntry`'s.

  - `PrecacheFallbackEntry` is an interface that requires a fallback URL and a matcher, which is used to check whether the current fallback entry can be used for a request.

  - To migrate:

    - Old:

    ```js
    new PrecacheFallbackPlugin({
      fallbackURL: "/~offline",
    });
    ```

    - New:

    ```js
    new PrecacheFallbackPlugin({
      fallbackUrls: ["/~offline"],
    });
    // Or
    new PrecacheFallbackPlugin({
      fallbackUrls: [
        {
          url: "/~offline",
          matcher({ request }) {
            return request.destination === "document";
          },
        },
      ],
    });
    ```

- With this change, `@serwist/sw.fallbacks` now also uses `PrecacheFallbackPlugin`. This means that `FallbackEntry.cacheMatchOptions` has been removed, for `PrecacheController.matchPrecache` doesn't support a custom `matchOptions`. This option is most likely not needed anyway.

  - To migrate:

    - Old:

    ```js
    fallbacks({
      entries: [
        {
          url: "/~offline",
          revision,
          matcher({ request }) {
            return request.destination === "document";
          },
          cacheMatchOptions: { ignoreSearch: true },
        },
      ],
      runtimeCaching,
    });
    ```

    - New:

    ```js
    fallbacks({
      entries: [
        {
          url: "/~offline",
          revision,
          matcher({ request }) {
            return request.destination === "document";
          },
        },
      ],
      runtimeCaching,
    });
    ```
