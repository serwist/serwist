---
"@serwist/sw": major
---

chore(sw): renamed `urlPattern` to `matcher`

- Quoting jeffposnick:

> Workbox used to go all-in on RegExp based routing for runtime caching, and the runtimeCaching options in our build tools use the property named urlPattern to configure the match criteria. This criteria is passed in under the hood to the first parameter of registerRoute(), which is overloaded and takes either a string, a RegExp, or a matchCallback function.
>
> Beyond the fact that this overloaded can be confusing, I think it's doubly-confusing that the runtimeCaching property is called urlPattern, in that it makes it seem like only a RegExp pattern is supported.
>
> I'd like to change that name to match as an alias for urlPattern, and then eventually deprecate urlPattern in a future release of Workbox.

- To migrate, simply rename `urlPattern` to `matcher`.

  - Old:

  ```ts
  registerRuntimeCaching(
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    }
  );
  ```

  - New:

  ```ts
  registerRuntimeCaching(
    {
      matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:js)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    {
      matcher: /\.(?:css|less)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    }
  );
  ```
