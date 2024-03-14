# @serwist/sw

## 9.0.0-preview.14

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.14
  - @serwist/broadcast-update@9.0.0-preview.14
  - @serwist/cacheable-response@9.0.0-preview.14
  - @serwist/core@9.0.0-preview.14
  - @serwist/expiration@9.0.0-preview.14
  - @serwist/google-analytics@9.0.0-preview.14
  - @serwist/navigation-preload@9.0.0-preview.14
  - @serwist/precaching@9.0.0-preview.14
  - @serwist/range-requests@9.0.0-preview.14
  - @serwist/routing@9.0.0-preview.14
  - @serwist/strategies@9.0.0-preview.14

## 9.0.0-preview.13

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.13
  - @serwist/broadcast-update@9.0.0-preview.13
  - @serwist/cacheable-response@9.0.0-preview.13
  - @serwist/core@9.0.0-preview.13
  - @serwist/expiration@9.0.0-preview.13
  - @serwist/google-analytics@9.0.0-preview.13
  - @serwist/navigation-preload@9.0.0-preview.13
  - @serwist/precaching@9.0.0-preview.13
  - @serwist/range-requests@9.0.0-preview.13
  - @serwist/routing@9.0.0-preview.13
  - @serwist/strategies@9.0.0-preview.13

## 9.0.0-preview.12

### Patch Changes

- [`b273b8c`](https://github.com/serwist/serwist/commit/b273b8cd9a240f8bf8ba357339e2e2d5dc2e8870) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(sw.handlePrecaching): fixed code still being erroneously executed when `precacheEntries` is falsy

  - We weren't supposed to handle `cleanupOutdatedCaches` and `navigateFallback` when the precache manifest is falsy. Really sorry for the inconvenience!

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.12
  - @serwist/broadcast-update@9.0.0-preview.12
  - @serwist/cacheable-response@9.0.0-preview.12
  - @serwist/core@9.0.0-preview.12
  - @serwist/expiration@9.0.0-preview.12
  - @serwist/google-analytics@9.0.0-preview.12
  - @serwist/navigation-preload@9.0.0-preview.12
  - @serwist/precaching@9.0.0-preview.12
  - @serwist/range-requests@9.0.0-preview.12
  - @serwist/routing@9.0.0-preview.12
  - @serwist/strategies@9.0.0-preview.12

## 9.0.0-preview.11

### Major Changes

- [`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor: use iterables

  - Serwist now uses iterables in its code. For instance, `Headers.prototype.entries()` can be noticed at parts of `@serwist/cacheable-response`.
  - This is partly thanks to our Node.js requirement being bumped to 18.0.0. Iterables have been supported in all major browsers for ages, so they wouldn't be a problem (hell, all browsers that support service workers have support for iterables).
  - Still, since this requires us to enforce the use of Node.js 18.0.0 or later, it is marked a breaking change.

### Patch Changes

- Updated dependencies [[`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063), [`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063)]:
  - @serwist/cacheable-response@9.0.0-preview.11
  - @serwist/navigation-preload@9.0.0-preview.11
  - @serwist/broadcast-update@9.0.0-preview.11
  - @serwist/google-analytics@9.0.0-preview.11
  - @serwist/background-sync@9.0.0-preview.11
  - @serwist/range-requests@9.0.0-preview.11
  - @serwist/expiration@9.0.0-preview.11
  - @serwist/precaching@9.0.0-preview.11
  - @serwist/strategies@9.0.0-preview.11
  - @serwist/routing@9.0.0-preview.11
  - @serwist/core@9.0.0-preview.11

## 9.0.0-preview.10

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.10
  - @serwist/broadcast-update@9.0.0-preview.10
  - @serwist/cacheable-response@9.0.0-preview.10
  - @serwist/core@9.0.0-preview.10
  - @serwist/expiration@9.0.0-preview.10
  - @serwist/google-analytics@9.0.0-preview.10
  - @serwist/navigation-preload@9.0.0-preview.10
  - @serwist/precaching@9.0.0-preview.10
  - @serwist/range-requests@9.0.0-preview.10
  - @serwist/routing@9.0.0-preview.10
  - @serwist/strategies@9.0.0-preview.10

## 9.0.0-preview.9

### Patch Changes

- Updated dependencies [[`7e42ad9`](https://github.com/serwist/serwist/commit/7e42ad912d96fdda160a7aad9a5548e7c046bc27)]:
  - @serwist/strategies@9.0.0-preview.9
  - @serwist/google-analytics@9.0.0-preview.9
  - @serwist/precaching@9.0.0-preview.9
  - @serwist/background-sync@9.0.0-preview.9
  - @serwist/broadcast-update@9.0.0-preview.9
  - @serwist/cacheable-response@9.0.0-preview.9
  - @serwist/core@9.0.0-preview.9
  - @serwist/expiration@9.0.0-preview.9
  - @serwist/navigation-preload@9.0.0-preview.9
  - @serwist/range-requests@9.0.0-preview.9
  - @serwist/routing@9.0.0-preview.9

## 9.0.0-preview.8

### Patch Changes

- Updated dependencies [[`b1df273`](https://github.com/serwist/serwist/commit/b1df273379ee018fd850f962345740874c9fd54d)]:
  - @serwist/cacheable-response@9.0.0-preview.8
  - @serwist/navigation-preload@9.0.0-preview.8
  - @serwist/broadcast-update@9.0.0-preview.8
  - @serwist/google-analytics@9.0.0-preview.8
  - @serwist/background-sync@9.0.0-preview.8
  - @serwist/range-requests@9.0.0-preview.8
  - @serwist/expiration@9.0.0-preview.8
  - @serwist/strategies@9.0.0-preview.8
  - @serwist/routing@9.0.0-preview.8
  - @serwist/core@9.0.0-preview.8
  - @serwist/precaching@9.0.0-preview.8

## 9.0.0-preview.7

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.7
  - @serwist/broadcast-update@9.0.0-preview.7
  - @serwist/cacheable-response@9.0.0-preview.7
  - @serwist/core@9.0.0-preview.7
  - @serwist/expiration@9.0.0-preview.7
  - @serwist/google-analytics@9.0.0-preview.7
  - @serwist/navigation-preload@9.0.0-preview.7
  - @serwist/precaching@9.0.0-preview.7
  - @serwist/range-requests@9.0.0-preview.7
  - @serwist/routing@9.0.0-preview.7
  - @serwist/strategies@9.0.0-preview.7

## 9.0.0-preview.6

### Patch Changes

- Updated dependencies [[`cbf3e46`](https://github.com/serwist/serwist/commit/cbf3e4603388257a799e4da5ba1f32bca58aba4b)]:
  - @serwist/precaching@9.0.0-preview.6
  - @serwist/background-sync@9.0.0-preview.6
  - @serwist/broadcast-update@9.0.0-preview.6
  - @serwist/cacheable-response@9.0.0-preview.6
  - @serwist/core@9.0.0-preview.6
  - @serwist/expiration@9.0.0-preview.6
  - @serwist/google-analytics@9.0.0-preview.6
  - @serwist/navigation-preload@9.0.0-preview.6
  - @serwist/range-requests@9.0.0-preview.6
  - @serwist/routing@9.0.0-preview.6
  - @serwist/strategies@9.0.0-preview.6

## 9.0.0-preview.5

### Major Changes

- [`dc12dda`](https://github.com/serwist/serwist/commit/dc12ddad60526db921b557f8dc5808ba17fc4d8e) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(sw): renamed `urlPattern` to `matcher`

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
      },
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
      },
    );
    ```

### Patch Changes

- Updated dependencies [[`dc12dda`](https://github.com/serwist/serwist/commit/dc12ddad60526db921b557f8dc5808ba17fc4d8e)]:
  - @serwist/google-analytics@9.0.0-preview.5
  - @serwist/background-sync@9.0.0-preview.5
  - @serwist/broadcast-update@9.0.0-preview.5
  - @serwist/cacheable-response@9.0.0-preview.5
  - @serwist/core@9.0.0-preview.5
  - @serwist/expiration@9.0.0-preview.5
  - @serwist/navigation-preload@9.0.0-preview.5
  - @serwist/precaching@9.0.0-preview.5
  - @serwist/range-requests@9.0.0-preview.5
  - @serwist/routing@9.0.0-preview.5
  - @serwist/strategies@9.0.0-preview.5

## 9.0.0-preview.4

### Major Changes

- [`6c3e789`](https://github.com/serwist/serwist/commit/6c3e789724533dab23a6f5afb2a0f40d8f26bf16) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(precaching.PrecacheFallbackPlugin): renamed `fallbackURL`, added support for a `matcher`

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

### Patch Changes

- Updated dependencies [[`6c3e789`](https://github.com/serwist/serwist/commit/6c3e789724533dab23a6f5afb2a0f40d8f26bf16)]:
  - @serwist/precaching@9.0.0-preview.4
  - @serwist/background-sync@9.0.0-preview.4
  - @serwist/broadcast-update@9.0.0-preview.4
  - @serwist/cacheable-response@9.0.0-preview.4
  - @serwist/core@9.0.0-preview.4
  - @serwist/expiration@9.0.0-preview.4
  - @serwist/google-analytics@9.0.0-preview.4
  - @serwist/navigation-preload@9.0.0-preview.4
  - @serwist/range-requests@9.0.0-preview.4
  - @serwist/routing@9.0.0-preview.4
  - @serwist/strategies@9.0.0-preview.4

## 9.0.0-preview.3

### Major Changes

- [`10c3c17`](https://github.com/serwist/serwist/commit/10c3c17a0021c87886c47c2588d8beca1cb21535) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(sw): removed support for string handlers in `registerRuntimeCaching`

  - `@serwist/sw.registerRuntimeCaching` no longer supports string handlers, such as `"NetworkFirst"`, `"NetworkOnly"`, `"CacheFirst"`, etc. You should migrate to passing `@serwist/strategies` instances yourself.

  - I believe that by supporting this, a relic of GenerateSW, we are simply adding unwarranted complexity to the codebase.

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
            request.headers.get("RSC") === "1" &&
            request.headers.get("Next-Router-Prefetch") === "1" &&
            sameOrigin &&
            !pathname.startsWith("/api/"),
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
          urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
            request.headers.get("RSC") === "1" &&
            sameOrigin &&
            !pathname.startsWith("/api/"),
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
            request.headers.get("Content-Type")?.includes("text/html") &&
            sameOrigin &&
            !pathname.startsWith("/api/"),
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
    import { installSerwist } from "@serwist/sw";

    installSerwist({
      // Other options...
      runtimeCaching: [
        {
          urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
            request.headers.get("RSC") === "1" &&
            request.headers.get("Next-Router-Prefetch") === "1" &&
            sameOrigin &&
            !pathname.startsWith("/api/"),
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
          urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
            request.headers.get("RSC") === "1" &&
            sameOrigin &&
            !pathname.startsWith("/api/"),
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
          urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
            request.headers.get("Content-Type")?.includes("text/html") &&
            sameOrigin &&
            !pathname.startsWith("/api/"),
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
    ```

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.3
  - @serwist/broadcast-update@9.0.0-preview.3
  - @serwist/cacheable-response@9.0.0-preview.3
  - @serwist/core@9.0.0-preview.3
  - @serwist/expiration@9.0.0-preview.3
  - @serwist/google-analytics@9.0.0-preview.3
  - @serwist/navigation-preload@9.0.0-preview.3
  - @serwist/precaching@9.0.0-preview.3
  - @serwist/range-requests@9.0.0-preview.3
  - @serwist/routing@9.0.0-preview.3
  - @serwist/strategies@9.0.0-preview.3

## 9.0.0-preview.2

### Patch Changes

- [`85bc781`](https://github.com/serwist/serwist/commit/85bc7812ed38f52bb04bbc79333950beafa75e42) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(sw): fixed `installSerwist` crashing

  - `logger.info` is not a valid method...

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.2
  - @serwist/broadcast-update@9.0.0-preview.2
  - @serwist/cacheable-response@9.0.0-preview.2
  - @serwist/core@9.0.0-preview.2
  - @serwist/expiration@9.0.0-preview.2
  - @serwist/google-analytics@9.0.0-preview.2
  - @serwist/navigation-preload@9.0.0-preview.2
  - @serwist/precaching@9.0.0-preview.2
  - @serwist/range-requests@9.0.0-preview.2
  - @serwist/routing@9.0.0-preview.2
  - @serwist/strategies@9.0.0-preview.2

## 9.0.0-preview.1

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.1
  - @serwist/broadcast-update@9.0.0-preview.1
  - @serwist/cacheable-response@9.0.0-preview.1
  - @serwist/core@9.0.0-preview.1
  - @serwist/expiration@9.0.0-preview.1
  - @serwist/google-analytics@9.0.0-preview.1
  - @serwist/navigation-preload@9.0.0-preview.1
  - @serwist/precaching@9.0.0-preview.1
  - @serwist/range-requests@9.0.0-preview.1
  - @serwist/routing@9.0.0-preview.1
  - @serwist/strategies@9.0.0-preview.1

## 9.0.0-preview.0

### Major Changes

- [`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(peerDeps): bump minimum supported TypeScript and Node.js version

  - From now, we only support TypeScript versions later than 5.0.0 and Node.js ones later than 18.0.0.
  - To migrate, simply update these tools.

  ```bash
  # Change to your preferred way of updating Node.js
  nvm use 18
  # Change to your package manager
  npm i -D typescript@5
  ```

- [`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(js): migrate to ESM-only

  - Serwist is now an ESM-only project.
  - This was done because our tooling around supporting CJS had always been crappy: it was slow, had no way of supporting emitting `.d.cts` (we used to copy `.d.ts` to `.d.cts`), and was too error-prone (there were various issues of our builds crashing due to an ESM-only package slipping in).
  - If you already use ESM, there's nothing to be done. Great! Otherwise, to migrate:

    - Migrate to ESM if possible.
    - Otherwise, use dynamic imports. For example, to migrate to the new `@serwist/next`:

      - Old:

      ```js
      // @ts-check
      const withSerwist = require("@serwist/next").default({
        cacheOnNavigation: true,
        swSrc: "app/sw.ts",
        swDest: "public/sw.js",
      });
      /** @type {import("next").NextConfig} */
      const nextConfig = {
        reactStrictMode: true,
      };

      module.exports = withSerwist(nextConfig);
      ```

      - New:

      ```js
      // @ts-check
      /** @type {import("next").NextConfig} */
      const nextConfig = {
        reactStrictMode: true,
      };

      module.exports = async () => {
        const withSerwist = (await import("@serwist/next")).default({
          cacheOnNavigation: true,
          swSrc: "app/sw.ts",
          swDest: "public/sw.js",
        });
        return withSerwist(nextConfig);
      };
      ```

  - I know that most of our current userbase use Next.js, which still suggests using a CJS config file, so I am really sorry for the trouble I have caused for you :( However, what needs to be done has to be done. It was time to migrate and get rid of old, legacy things.

- [`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(sw): disable `runtimeCaching`, `fallbacks`, and `registerRuntimeCaching` in development mode

  - In development mode, these features are now forcibly disabled. This is to prevent files from being accidentally served outdated.
  - If you want to override this, simply add the following:

  ```ts
  import { installSerwist } from "@serwist/sw";

  declare global {
    interface WorkerGlobalScope {
      __WB_FORCE_RUNTIME_CACHING: boolean;
    }
  }

  self.__WB_FORCE_RUNTIME_CACHING = true;

  installSerwist({
    runtimeCaching: [
      // ...
    ],
  });
  ```

- [`04d2619`](https://github.com/serwist/serwist/commit/04d26194b19936ba0425bf7b7e6c5e2ca9183813) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(sw): moved `@serwist/build.RuntimeCaching` to `@serwist/sw`

  - Since `runtimeCaching` is now a part of `@serwist/sw` rather than `@serwist/build`, it makes more sense to move the types there as well.
  - To migrate, simply update the imports.
    - Old:
    ```ts
    import type { StrategyName, RuntimeCaching } from "@serwist/build";
    ```
    - New:
    ```ts
    import type { StrategyName, RuntimeCaching } from "@serwist/sw";
    ```

### Patch Changes

- Updated dependencies [[`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58), [`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459)]:
  - @serwist/cacheable-response@9.0.0-preview.0
  - @serwist/navigation-preload@9.0.0-preview.0
  - @serwist/routing@9.0.0-preview.0
  - @serwist/core@9.0.0-preview.0
  - @serwist/broadcast-update@9.0.0-preview.0
  - @serwist/google-analytics@9.0.0-preview.0
  - @serwist/background-sync@9.0.0-preview.0
  - @serwist/range-requests@9.0.0-preview.0
  - @serwist/expiration@9.0.0-preview.0
  - @serwist/precaching@9.0.0-preview.0
  - @serwist/strategies@9.0.0-preview.0

## 8.4.4

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.4.4
  - @serwist/broadcast-update@8.4.4
  - @serwist/cacheable-response@8.4.4
  - @serwist/core@8.4.4
  - @serwist/expiration@8.4.4
  - @serwist/google-analytics@8.4.4
  - @serwist/navigation-preload@8.4.4
  - @serwist/precaching@8.4.4
  - @serwist/range-requests@8.4.4
  - @serwist/routing@8.4.4
  - @serwist/strategies@8.4.4

## 8.4.3

### Patch Changes

- [`6a1986c`](https://github.com/serwist/serwist/commit/6a1986cff4d004d240c49b2fbc5775e38d29ee25) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(sw): handle `RuntimeCaching.method` for `RuntimeCaching.handler` of type `"string"`

  - There really should be something that prevents us from encountering issues like this again... I am imagining a test, but not sure how that should be done.

- Updated dependencies []:
  - @serwist/background-sync@8.4.3
  - @serwist/broadcast-update@8.4.3
  - @serwist/cacheable-response@8.4.3
  - @serwist/core@8.4.3
  - @serwist/expiration@8.4.3
  - @serwist/google-analytics@8.4.3
  - @serwist/navigation-preload@8.4.3
  - @serwist/precaching@8.4.3
  - @serwist/range-requests@8.4.3
  - @serwist/routing@8.4.3
  - @serwist/strategies@8.4.3

## 8.4.2

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.4.2
  - @serwist/broadcast-update@8.4.2
  - @serwist/cacheable-response@8.4.2
  - @serwist/core@8.4.2
  - @serwist/expiration@8.4.2
  - @serwist/google-analytics@8.4.2
  - @serwist/navigation-preload@8.4.2
  - @serwist/precaching@8.4.2
  - @serwist/range-requests@8.4.2
  - @serwist/routing@8.4.2
  - @serwist/strategies@8.4.2

## 8.4.1

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.4.1
  - @serwist/broadcast-update@8.4.1
  - @serwist/cacheable-response@8.4.1
  - @serwist/core@8.4.1
  - @serwist/expiration@8.4.1
  - @serwist/google-analytics@8.4.1
  - @serwist/navigation-preload@8.4.1
  - @serwist/precaching@8.4.1
  - @serwist/range-requests@8.4.1
  - @serwist/routing@8.4.1
  - @serwist/strategies@8.4.1

## 8.4.0

### Patch Changes

- [#32](https://github.com/serwist/serwist/pull/32) [`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(docs): changed docs's URL

  - Currently we deploy at Cloudflare Pages.

- Updated dependencies [[`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d)]:
  - @serwist/cacheable-response@8.4.0
  - @serwist/navigation-preload@8.4.0
  - @serwist/broadcast-update@8.4.0
  - @serwist/google-analytics@8.4.0
  - @serwist/background-sync@8.4.0
  - @serwist/range-requests@8.4.0
  - @serwist/expiration@8.4.0
  - @serwist/precaching@8.4.0
  - @serwist/strategies@8.4.0
  - @serwist/routing@8.4.0
  - @serwist/core@8.4.0

## 8.3.0

### Patch Changes

- Updated dependencies [[`bd75087`](https://github.com/serwist/serwist/commit/bd7508722a50bc2191d24a1e6e55a835060ba350)]:
  - @serwist/core@8.3.0
  - @serwist/background-sync@8.3.0
  - @serwist/broadcast-update@8.3.0
  - @serwist/cacheable-response@8.3.0
  - @serwist/expiration@8.3.0
  - @serwist/google-analytics@8.3.0
  - @serwist/navigation-preload@8.3.0
  - @serwist/precaching@8.3.0
  - @serwist/range-requests@8.3.0
  - @serwist/routing@8.3.0
  - @serwist/strategies@8.3.0

## 8.2.0

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.2.0
  - @serwist/broadcast-update@8.2.0
  - @serwist/cacheable-response@8.2.0
  - @serwist/core@8.2.0
  - @serwist/expiration@8.2.0
  - @serwist/google-analytics@8.2.0
  - @serwist/navigation-preload@8.2.0
  - @serwist/precaching@8.2.0
  - @serwist/range-requests@8.2.0
  - @serwist/routing@8.2.0
  - @serwist/strategies@8.2.0

## 8.1.1

### Patch Changes

- [`b7916b6`](https://github.com/serwist/serwist/commit/b7916b6fd6a765b87a522df3518973547cbc4a02) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(sw): fixed `fallbacks` API

  - `FallbacksOptions.matchOptions` was actually meant to be `FallbackEntry.cacheMatchOptions`. Sorry for the inconvenience :(

- Updated dependencies []:
  - @serwist/background-sync@8.1.1
  - @serwist/broadcast-update@8.1.1
  - @serwist/cacheable-response@8.1.1
  - @serwist/core@8.1.1
  - @serwist/expiration@8.1.1
  - @serwist/google-analytics@8.1.1
  - @serwist/navigation-preload@8.1.1
  - @serwist/precaching@8.1.1
  - @serwist/range-requests@8.1.1
  - @serwist/routing@8.1.1
  - @serwist/strategies@8.1.1

## 8.1.0

### Minor Changes

- [`4ad112e`](https://github.com/serwist/serwist/commit/4ad112e782dd2b1c341db05ef125c8bbbf9fbf14) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(sw): added fallbacks

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

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.1.0
  - @serwist/broadcast-update@8.1.0
  - @serwist/cacheable-response@8.1.0
  - @serwist/core@8.1.0
  - @serwist/expiration@8.1.0
  - @serwist/google-analytics@8.1.0
  - @serwist/navigation-preload@8.1.0
  - @serwist/precaching@8.1.0
  - @serwist/range-requests@8.1.0
  - @serwist/routing@8.1.0
  - @serwist/strategies@8.1.0

## 8.0.5

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.0.5
  - @serwist/broadcast-update@8.0.5
  - @serwist/cacheable-response@8.0.5
  - @serwist/core@8.0.5
  - @serwist/expiration@8.0.5
  - @serwist/google-analytics@8.0.5
  - @serwist/navigation-preload@8.0.5
  - @serwist/precaching@8.0.5
  - @serwist/range-requests@8.0.5
  - @serwist/routing@8.0.5
  - @serwist/strategies@8.0.5

## 8.0.4

### Patch Changes

- [#10](https://github.com/serwist/serwist/pull/10) [`52edfe2`](https://github.com/serwist/serwist/commit/52edfe2f9e4ff2007747dd038023dbc94af52698) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(node-16-cjs): added type support for NodeNext with CommonJS

  - The "fix" is really simple - we copy `.d.ts` to `.old.d.cts` 💀
  - This also fixes the issue where using `@serwist/build`, `@serwist/webpack-plugin`, and their dependents with CommonJS crashes due to us using `pretty-bytes`, which is an ESM package.

- Updated dependencies [[`52edfe2`](https://github.com/serwist/serwist/commit/52edfe2f9e4ff2007747dd038023dbc94af52698)]:
  - @serwist/cacheable-response@8.0.4
  - @serwist/navigation-preload@8.0.4
  - @serwist/broadcast-update@8.0.4
  - @serwist/google-analytics@8.0.4
  - @serwist/background-sync@8.0.4
  - @serwist/range-requests@8.0.4
  - @serwist/expiration@8.0.4
  - @serwist/precaching@8.0.4
  - @serwist/strategies@8.0.4
  - @serwist/routing@8.0.4
  - @serwist/core@8.0.4

## 8.0.3

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.0.3
  - @serwist/broadcast-update@8.0.3
  - @serwist/cacheable-response@8.0.3
  - @serwist/core@8.0.3
  - @serwist/expiration@8.0.3
  - @serwist/google-analytics@8.0.3
  - @serwist/navigation-preload@8.0.3
  - @serwist/precaching@8.0.3
  - @serwist/range-requests@8.0.3
  - @serwist/routing@8.0.3
  - @serwist/strategies@8.0.3

## 8.0.2

### Patch Changes

- [`59939b1`](https://github.com/serwist/serwist/commit/59939b19d8db043d5fa70ba71bd85534c288aab1) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(sw): allow `offlineAnalyticsConfig` to be a boolean

  - I actually forgot this...

- Updated dependencies []:
  - @serwist/background-sync@8.0.2
  - @serwist/broadcast-update@8.0.2
  - @serwist/cacheable-response@8.0.2
  - @serwist/core@8.0.2
  - @serwist/expiration@8.0.2
  - @serwist/google-analytics@8.0.2
  - @serwist/navigation-preload@8.0.2
  - @serwist/precaching@8.0.2
  - @serwist/range-requests@8.0.2
  - @serwist/routing@8.0.2
  - @serwist/strategies@8.0.2

## 8.0.1

### Patch Changes

- [`15fb388`](https://github.com/serwist/serwist/commit/15fb38839a5b3b06bdaa39994fba29b56d05b301) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(publish): removed declarations map

- Updated dependencies [[`15fb388`](https://github.com/serwist/serwist/commit/15fb38839a5b3b06bdaa39994fba29b56d05b301)]:
  - @serwist/background-sync@8.0.1
  - @serwist/broadcast-update@8.0.1
  - @serwist/cacheable-response@8.0.1
  - @serwist/core@8.0.1
  - @serwist/expiration@8.0.1
  - @serwist/google-analytics@8.0.1
  - @serwist/navigation-preload@8.0.1
  - @serwist/precaching@8.0.1
  - @serwist/range-requests@8.0.1
  - @serwist/routing@8.0.1
  - @serwist/strategies@8.0.1

## 8.0.0

### Major Changes

- [`e0313f0`](https://github.com/serwist/serwist/commit/e0313f02f661a07ccbe9edc64e44e1af6136c73e) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: initial release

  - Reimagined `@serwist/next`.
    - Removed various options.
      - Removed `aggressiveFrontEndNavCaching` to reassess its usefulness.
      - Removed `browserslist`. Use `swcEnvTargets` instead (TODO: add this option).
      - Custom workers have been removed. You should use `swSrc`.
      - Removed `extendDefaultRuntimeCaching`. Use the spread syntax instead (use `import { defaultCache } from "@serwist/next/browser"` to import the default runtimeCaching array).
      - Temporarily removed `fallbacks` to investigate module-friendly alternatives.
      - Removed `swcMinify`.
      - Removed `watchWorkersInDev`.
      - Removed `cacheStartUrl`, `dynamicStartUrl`, and `dynamicStartUrl`. These shall be re-added only when their use cases are made more clear to me.
    - Merged `workboxOptions` with the plugin's options.
    - Removed `swc-loader`, `terser-minify`, `webpack-builders`,... (we now leverage `ChildCompilationPlugin` to compile workers - this change will be backported to `@ducanh2912/next-pwa@10`)
    - Removed the ability to use GenerateSW. `@serwist/sw.installSerwist` is provided as a replacement.
    - `swSrc` is now a required property.
    - Moved minimum support Next.js version from `11.0.0` to `14.0.0`.
  - Removed GenerateSW (replaced by `@serwist/sw.installSerwist`).
    - See `examples/next-basic/app/sw.ts` to see how `installSerwist` should be used.
  - Repurposed `@serwist/sw`.
    - The old package might be reintroduced if there's demand.
  - **Note:** This is just the initial release, and there is still a lot of ground to cover (a lot of legacy code to be removed, a lot of features to be reintroduced,...). Here's to a bright future for the project :\_)

### Patch Changes

- Updated dependencies [[`e0313f0`](https://github.com/serwist/serwist/commit/e0313f02f661a07ccbe9edc64e44e1af6136c73e)]:
  - @serwist/cacheable-response@8.0.0
  - @serwist/navigation-preload@8.0.0
  - @serwist/broadcast-update@8.0.0
  - @serwist/google-analytics@8.0.0
  - @serwist/background-sync@8.0.0
  - @serwist/range-requests@8.0.0
  - @serwist/expiration@8.0.0
  - @serwist/precaching@8.0.0
  - @serwist/strategies@8.0.0
  - @serwist/routing@8.0.0
  - @serwist/core@8.0.0
