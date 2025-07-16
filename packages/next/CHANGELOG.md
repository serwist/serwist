# @serwist/next

## 9.1.0

### Minor Changes

- [`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(build): migrate to Zod 4

  - This fixes issues with Zod validation.
  - We've migrated to `z.prettifyError`, meaning you can expect to see this new format of errors:

    ```
    Error: Invalid @serwist/next configuration:
    ✖ Received invalid type: expected boolean, received string.
      → at cacheOnNavigation
    ✖ Received invalid union:
      → Received invalid type: expected string, received boolean.
      → Received invalid type: expected object, received boolean.
      → at additionalPrecacheEntries[1]
    ✖ Received invalid union:
      → Received invalid type: expected string, received boolean.
      → Received invalid type: expected object, received boolean.
      → at additionalPrecacheEntries[2]
    ✖ Received invalid union:
      → Received invalid type: expected string, received function.
      → Received invalid type: expected object, received function.
      → at additionalPrecacheEntries[3]
        at validateInjectManifestOptions (../../packages/next/dist/index.js:92:15)
        at Object.webpack (../../packages/next/dist/index.js:114:144)
    ```

### Patch Changes

- [`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95), [`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95)]:
  - @serwist/webpack-plugin@9.1.0
  - @serwist/window@9.1.0
  - @serwist/build@9.1.0
  - serwist@9.1.0

## 9.0.15

### Patch Changes

- [`de27be5`](https://github.com/serwist/serwist/commit/de27be5c8c48afc6122e046dc116696cedfc93e4) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix: Update cacheOnNavigation document page

  - Thanks @zsh77! Here's the PR message:

  replaced the duplicated `history.pushState` with `history.replaceState`

- [`de27be5`](https://github.com/serwist/serwist/commit/de27be5c8c48afc6122e046dc116696cedfc93e4) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

  - Just the regular stuff. Serwist 10 is still on the way!

- Updated dependencies [[`de27be5`](https://github.com/serwist/serwist/commit/de27be5c8c48afc6122e046dc116696cedfc93e4)]:
  - @serwist/webpack-plugin@9.0.15
  - @serwist/window@9.0.15
  - @serwist/build@9.0.15
  - serwist@9.0.15

## 9.0.14

### Patch Changes

- [#255](https://github.com/serwist/serwist/pull/255) [`7827857`](https://github.com/serwist/serwist/commit/782785742632df065cfbc3cc6dd2e6ad61444e4e) Thanks [@adamfratino](https://github.com/adamfratino)! - fix(next): re-word Turbopack console warning to fix issue URL

- Updated dependencies []:
  - @serwist/build@9.0.14
  - @serwist/webpack-plugin@9.0.14
  - @serwist/window@9.0.14
  - serwist@9.0.14

## 9.0.11

### Patch Changes

- [`cdefdc3`](https://github.com/serwist/serwist/commit/cdefdc32247f45a553a7a7ce4ff549fdf04290ce) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`cdefdc3`](https://github.com/serwist/serwist/commit/cdefdc32247f45a553a7a7ce4ff549fdf04290ce)]:
  - @serwist/webpack-plugin@9.0.11
  - @serwist/window@9.0.11
  - @serwist/build@9.0.11
  - serwist@9.0.11

## 9.0.10

### Patch Changes

- [`7e99285`](https://github.com/serwist/serwist/commit/7e9928532254633fbf49e1e1b83fcf48bcccce60) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(next): fixed `__dirname` conflict in CommonJS

  - Thanks @jthcast! Their message:

  > If you use `storybook` and `serwist` together, they will conflict for `__dirname` variable. Because it is already created with a global scope, it cannot be used by branching from the business logic it uses. So I suggest moving to scope within the function.

- Updated dependencies []:
  - @serwist/build@9.0.10
  - @serwist/webpack-plugin@9.0.10
  - @serwist/window@9.0.10
  - serwist@9.0.10

## 9.0.9

### Patch Changes

- Updated dependencies [[`c19cc79`](https://github.com/serwist/serwist/commit/c19cc79bda805d1ca3d3bfa62f5c712fde54ab7f)]:
  - @serwist/build@9.0.9
  - @serwist/webpack-plugin@9.0.9
  - @serwist/window@9.0.9
  - serwist@9.0.9

## 9.0.8

### Patch Changes

- Updated dependencies [[`ffb64c4`](https://github.com/serwist/serwist/commit/ffb64c4d26a7bd67525aa14b10c156fe04cadcd6)]:
  - serwist@9.0.8
  - @serwist/window@9.0.8
  - @serwist/build@9.0.8
  - @serwist/webpack-plugin@9.0.8

## 9.0.7

### Patch Changes

- [#192](https://github.com/serwist/serwist/pull/192) [`ceea5d1`](https://github.com/serwist/serwist/commit/ceea5d1d56dfec9b3aafba41bd0b0f2916a4ac17) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(build): remove extraneous Node.js API wrappers

  - Doesn't seem that we really need `fs-extra`, `pathe`, `fast-json-stable-stringify`, or `upath`, so let's just remove them.
  - This also adds tests for Windows to ensure that we don't mess up.

- Updated dependencies [[`ceea5d1`](https://github.com/serwist/serwist/commit/ceea5d1d56dfec9b3aafba41bd0b0f2916a4ac17)]:
  - @serwist/webpack-plugin@9.0.7
  - @serwist/build@9.0.7
  - @serwist/window@9.0.7
  - serwist@9.0.7

## 9.0.6

### Patch Changes

- Updated dependencies [[`12f6e82`](https://github.com/serwist/serwist/commit/12f6e824020ded438e0afa91a570d8e321a1a3f7), [`1e9cc3c`](https://github.com/serwist/serwist/commit/1e9cc3c45511f93d328555eb090df0e613bca403)]:
  - @serwist/webpack-plugin@9.0.6
  - serwist@9.0.6
  - @serwist/window@9.0.6
  - @serwist/build@9.0.6

## 9.0.5

### Patch Changes

- [#168](https://github.com/serwist/serwist/pull/168) [`c7bed2b`](https://github.com/serwist/serwist/commit/c7bed2b3a16be9b60cbb485500a3e893615f321d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(dependencies): reverted `glob` to v10 and `rimraf` to v5

  - Turns out `glob` v11 and `rimraf` v6 drops support for Node.js 18, so we are back to v10 and v5 for now.
  - This also adds test for Node.js 18 and 22.

- Updated dependencies [[`c7bed2b`](https://github.com/serwist/serwist/commit/c7bed2b3a16be9b60cbb485500a3e893615f321d)]:
  - @serwist/webpack-plugin@9.0.5
  - @serwist/build@9.0.5
  - @serwist/window@9.0.5
  - serwist@9.0.5

## 9.0.4

### Patch Changes

- [`db66e96`](https://github.com/serwist/serwist/commit/db66e96cb7fd8857200efc261d60cffaca1c0177) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`db66e96`](https://github.com/serwist/serwist/commit/db66e96cb7fd8857200efc261d60cffaca1c0177), [`db66e96`](https://github.com/serwist/serwist/commit/db66e96cb7fd8857200efc261d60cffaca1c0177)]:
  - @serwist/webpack-plugin@9.0.4
  - @serwist/window@9.0.4
  - @serwist/build@9.0.4
  - serwist@9.0.4

## 9.0.3

### Patch Changes

- [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): updated all dependencies

  - We have updated all dependencies to latest, as usual.

- [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(frameworks): use `NetworkOnly` for `defaultCache` in dev

  - If we set `runtimeCaching` to an empty array, all preload responses are discarded, causing certain browsers to log a certain error message. This change fixes that error for developers using `defaultCache` in development mode.

- Updated dependencies [[`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed), [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed), [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed)]:
  - serwist@9.0.3
  - @serwist/webpack-plugin@9.0.3
  - @serwist/window@9.0.3
  - @serwist/build@9.0.3

## 9.0.2

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.2
  - @serwist/webpack-plugin@9.0.2
  - @serwist/window@9.0.2
  - serwist@9.0.2

## 9.0.1

### Patch Changes

- [#128](https://github.com/serwist/serwist/pull/128) [`ee8fa90`](https://github.com/serwist/serwist/commit/ee8fa9026ada9d708cf828c0b1ef0e37bb1e1020) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(next): check if the current page is in the service worker's scope before registering

  - Before, if `InjectPartial.scope` was set to some value, and you visited a page out of that scope, you would see the warning "The current page is not in scope for the registered service worker. Was this a mistake?" logged. This simply fixes that by checking if the page is in the scope before calling `window.serwist.register()`.
  - Wondering if we should have removed /sw-entry.ts before the 9.0.0 release...

- Updated dependencies []:
  - @serwist/build@9.0.1
  - @serwist/webpack-plugin@9.0.1
  - @serwist/window@9.0.1
  - serwist@9.0.0

## 9.0.0

### Major Changes

- [#123](https://github.com/serwist/serwist/pull/123) [`add4fdd`](https://github.com/serwist/serwist/commit/add4fdd390555053d023faebfe1dca41510b2e2f) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(build): moved framework-specific types out of `@serwist/build`

  - Types the likes of `WebpackPartial`, `WebpackInjectManifestOptions`, `ViteInjectManifestOptions`, along with their according validators have been moved out of `@serwist/build`.
  - This design, a relic of Workbox, never made any sense in the first place. As such, we are getting rid of it and migrating to a design where types and validators are co-located with their related packages.
  - To migrate, update the imports:

    - `@serwist/build.WebpackPartial` -> `@serwist/webpack-plugin.WebpackPartial`
    - `@serwist/build.WebpackInjectManifestOptions` -> `@serwist/webpack-plugin.InjectManifestOptions`
    - `@serwist/build.WebpackInjectManifestPartial` -> `Omit<import("@serwist/webpack-plugin").InjectManifestOptions, keyof import("@serwist/build").BasePartial | keyof import("@serwist/build").InjectPartial | keyof import("@serwist/webpack-plugin").WebpackPartial | keyof import("@serwist/build").OptionalSwDestPartial>`
    - `@serwist/build.ViteInjectManifestOptions` -> `@serwist/vite.PluginOptions`

  - With this change, validators and schemas have also been made public. Validators can be imported from "/" files, whereas schemas can be imported from "/schema" ones.

- [#123](https://github.com/serwist/serwist/pull/123) [`4a5d51a`](https://github.com/serwist/serwist/commit/4a5d51ac8e9ed97b97754d8164990a08be65846d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(next): renamed "/browser" to "/worker"

  - This new name makes more sense than the old one, for these exports are actually for use in service workers.
  - To migrate, simply change all imports of `@serwist/next/browser` to those of `@serwist/next/worker`:

    - Old:

    ```ts
    import { installSerwist } from "@serwist/sw";
    import { defaultCache } from "@serwist/next/browser";

    installSerwist({
      // Other options
      runtimeCaching: defaultCache,
    });
    ```

    - New:

    ```ts
    import { Serwist } from "serwist";
    import { defaultCache } from "@serwist/next/worker";

    const serwist = new Serwist({
      // Other options
      runtimeCaching: defaultCache,
    });

    serwist.addEventListeners();
    ```

- [#123](https://github.com/serwist/serwist/pull/123) [`4a5d51a`](https://github.com/serwist/serwist/commit/4a5d51ac8e9ed97b97754d8164990a08be65846d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(peerDeps): bump minimum supported TypeScript and Node.js version

  - From now, we only support TypeScript versions later than 5.0.0 and Node.js ones later than 18.0.0.
  - To migrate, simply update these tools.

  ```bash
  # Change to your preferred way of updating Node.js
  nvm use 18
  # Change to your package manager
  npm i -D typescript@5
  ```

- [#123](https://github.com/serwist/serwist/pull/123) [`7b55ac5`](https://github.com/serwist/serwist/commit/7b55ac526a73826cb2d179a863d7eb29182616ee) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(js): dropped the CommonJS build

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

    - If all else fails, use `require(esm)`. This may or may not be supported on your current Node.js version.

- [#123](https://github.com/serwist/serwist/pull/123) [`7524712`](https://github.com/serwist/serwist/commit/75247128031de3067676b08b21833b5d2e1d1f14) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(next): changed `defaultCache`'s `"next-data"`'s handler to `NetworkFirst`

  - Using `StaleWhileRevalidate` affects `getServerSideProps`'s freshness. See https://github.com/serwist/serwist/issues/74 for more details.
  - There's nothing to be done on your side.

- [#123](https://github.com/serwist/serwist/pull/123) [`837cd0d`](https://github.com/serwist/serwist/commit/837cd0d7caaa03e0d3334bbf707ac9147a844285) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(next): renamed `cacheOnFrontEndNav` to `cacheOnNavigation`

  - Generally, we avoid using abbreviations (except for acronyms) to name Serwist's APIs.
  - To migrate, simply replace `cacheOnFrontEndNav` with `cacheOnNavigation`:

    - Old:

    ```js
    const withSerwist = withSerwistInit({
      cacheOnFrontEndNav: true,
    });

    /** @type {import("next").NextConfig} */
    const nextConfig = {};

    export default withSerwist(nextConfig);
    ```

    - New:

    ```js
    const withSerwist = withSerwistInit({
      cacheOnNavigation: true,
    });

    /** @type {import("next").NextConfig} */
    const nextConfig = {};

    export default withSerwist(nextConfig);
    ```

### Minor Changes

- [#123](https://github.com/serwist/serwist/pull/123) [`51a686f`](https://github.com/serwist/serwist/commit/51a686f10980ff45a0f8c10a2745ba5035d2e34d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(webpack,next): allow webpack to be an optional `peerDependency`

  - Since we support frameworks that ship a prebundled webpack, such as Next.js, it would be nice if we can take advantage of that as well.
  - As a result, webpack is now an optional `peerDependency` for `@serwist/webpack-plugin` and is no longer a `peerDependency` for `@serwist/next`. Thanks to the fact that we currently don't use any webpack plugin, it is also not indirectly installed.

- [#123](https://github.com/serwist/serwist/pull/123) [`4a5d51a`](https://github.com/serwist/serwist/commit/4a5d51ac8e9ed97b97754d8164990a08be65846d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(next): added `@serwist/next/worker.PAGES_CACHE_NAME`

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
          urlPattern: ({ request, url: { pathname }, sameOrigin }) =>
            request.headers.get("RSC") === "1" && sameOrigin && !pathname.startsWith("/api/"),
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
    import { Serwist } from "serwist";

    const serwist = new Serwist({
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

    serwist.addEventListeners();
    ```

### Patch Changes

- [#123](https://github.com/serwist/serwist/pull/123) [`db7776e`](https://github.com/serwist/serwist/commit/db7776e6f55f4d1cf62ea8975c8460cb92c28138) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(svelte,next,vite): force `defaultCache` to only use `NetworkOnly` in development mode

  - This is to prevent files from being accidentally cached during development mode, which isn't the behaviour you would expect to see anyway.
  - URLs that are matched by these entries in production are now handled by `NetworkOnly` in development. No option to override this behaviour is provided, for it would provide little to no value. If you do need runtime caching to work during development, you have to copy `defaultCache` into your code.
  - As a reminder for those who extend `defaultCache`, it should be placed below any custom entry, since such an entry wouldn't ever be matched otherwise.

- Updated dependencies [[`add4fdd`](https://github.com/serwist/serwist/commit/add4fdd390555053d023faebfe1dca41510b2e2f), [`b1df273`](https://github.com/serwist/serwist/commit/b1df273379ee018fd850f962345740874c9fd54d), [`c65578b`](https://github.com/serwist/serwist/commit/c65578b68f1ae88822238c3c03aa5e859a4f2b7e), [`b273b8c`](https://github.com/serwist/serwist/commit/b273b8cd9a240f8bf8ba357339e2e2d5dc2e8870), [`6c3e789`](https://github.com/serwist/serwist/commit/6c3e789724533dab23a6f5afb2a0f40d8f26bf16), [`7b55ac5`](https://github.com/serwist/serwist/commit/7b55ac526a73826cb2d179a863d7eb29182616ee), [`4a5d51a`](https://github.com/serwist/serwist/commit/4a5d51ac8e9ed97b97754d8164990a08be65846d), [`51a686f`](https://github.com/serwist/serwist/commit/51a686f10980ff45a0f8c10a2745ba5035d2e34d), [`dc12dda`](https://github.com/serwist/serwist/commit/dc12ddad60526db921b557f8dc5808ba17fc4d8e), [`7b55ac5`](https://github.com/serwist/serwist/commit/7b55ac526a73826cb2d179a863d7eb29182616ee), [`e4c00af`](https://github.com/serwist/serwist/commit/e4c00af72a9bd6a9d06e8a51d7db0006c732f7fd), [`dc12dda`](https://github.com/serwist/serwist/commit/dc12ddad60526db921b557f8dc5808ba17fc4d8e), [`10c3c17`](https://github.com/serwist/serwist/commit/10c3c17a0021c87886c47c2588d8beca1cb21535), [`4a5d51a`](https://github.com/serwist/serwist/commit/4a5d51ac8e9ed97b97754d8164990a08be65846d)]:
  - @serwist/webpack-plugin@9.0.0
  - @serwist/build@9.0.0
  - serwist@9.0.0
  - @serwist/window@9.0.0

## 9.0.0-preview.26

### Patch Changes

- [`3a16582`](https://github.com/serwist/serwist/commit/3a165826cd07bb02f2cd2a8a7bedaf7c2bbeaed5) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: second stability test before stable release

- Updated dependencies [[`3a16582`](https://github.com/serwist/serwist/commit/3a165826cd07bb02f2cd2a8a7bedaf7c2bbeaed5)]:
  - @serwist/webpack-plugin@9.0.0-preview.26
  - @serwist/window@9.0.0-preview.26
  - @serwist/build@9.0.0-preview.26
  - serwist@9.0.0-preview.26

## 9.0.0-preview.25

### Patch Changes

- [`7e00b79`](https://github.com/serwist/serwist/commit/7e00b79d3888fcdd0b2ac0c2cf5060b9cf91a9ea) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: stability test before stable release

- Updated dependencies [[`7e00b79`](https://github.com/serwist/serwist/commit/7e00b79d3888fcdd0b2ac0c2cf5060b9cf91a9ea)]:
  - @serwist/webpack-plugin@9.0.0-preview.25
  - @serwist/window@9.0.0-preview.25
  - @serwist/build@9.0.0-preview.25
  - serwist@9.0.0-preview.25

## 9.0.0-preview.24

### Patch Changes

- Updated dependencies [e4c00af]
  - serwist@9.0.0-preview.24
  - @serwist/window@9.0.0-preview.24
  - @serwist/build@9.0.0-preview.24
  - @serwist/webpack-plugin@9.0.0-preview.24

## 9.0.0-preview.23

### Patch Changes

- Updated dependencies [e30e2eb]
  - @serwist/window@9.0.0-preview.23
  - @serwist/build@9.0.0-preview.23
  - @serwist/core@9.0.0-preview.23
  - @serwist/sw@9.0.0-preview.23
  - @serwist/webpack-plugin@9.0.0-preview.23

## 9.0.0-preview.22

### Patch Changes

- Updated dependencies
  - @serwist/window@9.0.0-preview.22
  - @serwist/build@9.0.0-preview.22
  - @serwist/core@9.0.0-preview.22
  - @serwist/sw@9.0.0-preview.22
  - @serwist/webpack-plugin@9.0.0-preview.22

## 9.0.0-preview.21

### Patch Changes

- Updated dependencies [6ed7da2]
- Updated dependencies
  - @serwist/window@9.0.0-preview.21
  - @serwist/build@9.0.0-preview.21
  - @serwist/core@9.0.0-preview.21
  - @serwist/sw@9.0.0-preview.21
  - @serwist/webpack-plugin@9.0.0-preview.21

## 9.0.0-preview.20

### Patch Changes

- Updated dependencies [10c9394]
  - @serwist/sw@9.0.0-preview.20
  - @serwist/build@9.0.0-preview.20
  - @serwist/core@9.0.0-preview.20
  - @serwist/webpack-plugin@9.0.0-preview.20
  - @serwist/window@9.0.0-preview.20

## 9.0.0-preview.19

### Patch Changes

- 6d294f9: refactor: migrate to GitLab

  - Serwist and `@ducanh2912/next-pwa` have migrated to GitLab.
  - This was the result of GitHub flagging my account, organizations, and repositories as spam. Sorry for the inconvenience.

- Updated dependencies [6d294f9]
  - @serwist/webpack-plugin@9.0.0-preview.19
  - @serwist/window@9.0.0-preview.19
  - @serwist/build@9.0.0-preview.19
  - @serwist/core@9.0.0-preview.19
  - @serwist/sw@9.0.0-preview.19

## 9.0.0-preview.18

### Patch Changes

- Updated dependencies [[`c65578b`](https://github.com/serwist/serwist/commit/c65578b68f1ae88822238c3c03aa5e859a4f2b7e)]:
  - @serwist/sw@9.0.0-preview.18
  - @serwist/build@9.0.0-preview.18
  - @serwist/core@9.0.0-preview.18
  - @serwist/webpack-plugin@9.0.0-preview.18
  - @serwist/window@9.0.0-preview.18

## 9.0.0-preview.17

### Patch Changes

- Updated dependencies [[`97b36c7`](https://github.com/serwist/serwist/commit/97b36c752c4f0ea9bc7beaf41733c5dcc5d02cb9)]:
  - @serwist/sw@9.0.0-preview.17
  - @serwist/build@9.0.0-preview.17
  - @serwist/core@9.0.0-preview.17
  - @serwist/expiration@9.0.0-preview.17
  - @serwist/range-requests@9.0.0-preview.17
  - @serwist/strategies@9.0.0-preview.17
  - @serwist/webpack-plugin@9.0.0-preview.17
  - @serwist/window@9.0.0-preview.17

## 9.0.0-preview.16

### Patch Changes

- [`db7776e`](https://github.com/serwist/serwist/commit/db7776e6f55f4d1cf62ea8975c8460cb92c28138) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(svelte,next,vite): force `defaultCache` to only use NetworkOnly in development mode

  - This is to prevent files from being accidentally cached during development mode, which isn't the behaviour you would expect to see anyway.
  - URLs that are matched by these entries in production are now handled by NetworkOnly in development. No option to override this behaviour is provided, for it would provide little to no value. If you do need runtime caching to work during development, you have to copy `defaultCache` into your code.
  - As a reminder for those who extend `defaultCache`, it should be placed below any custom entry, since such an entry wouldn't ever be matched otherwise.

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.16
  - @serwist/core@9.0.0-preview.16
  - @serwist/expiration@9.0.0-preview.16
  - @serwist/range-requests@9.0.0-preview.16
  - @serwist/strategies@9.0.0-preview.16
  - @serwist/sw@9.0.0-preview.16
  - @serwist/webpack-plugin@9.0.0-preview.16
  - @serwist/window@9.0.0-preview.16

## 9.0.0-preview.15

### Patch Changes

- Updated dependencies [[`c47a8b2`](https://github.com/serwist/serwist/commit/c47a8b27c0dcd4fad4195b15eb7bd7b0a7c234c8)]:
  - @serwist/expiration@9.0.0-preview.15
  - @serwist/sw@9.0.0-preview.15
  - @serwist/build@9.0.0-preview.15
  - @serwist/core@9.0.0-preview.15
  - @serwist/range-requests@9.0.0-preview.15
  - @serwist/strategies@9.0.0-preview.15
  - @serwist/webpack-plugin@9.0.0-preview.15
  - @serwist/window@9.0.0-preview.15

## 9.0.0-preview.14

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.14
  - @serwist/core@9.0.0-preview.14
  - @serwist/expiration@9.0.0-preview.14
  - @serwist/range-requests@9.0.0-preview.14
  - @serwist/strategies@9.0.0-preview.14
  - @serwist/sw@9.0.0-preview.14
  - @serwist/webpack-plugin@9.0.0-preview.14
  - @serwist/window@9.0.0-preview.14

## 9.0.0-preview.13

### Major Changes

- [`add4fdd`](https://github.com/serwist/serwist/commit/add4fdd390555053d023faebfe1dca41510b2e2f) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(build): moved framework-specific types out of `@serwist/build`

  - Types the likes of `WebpackPartial`, `WebpackInjectManifestOptions`, `ViteInjectManifestOptions`, along with their according validators have been moved out of `@serwist/build`.
  - This design, a relic of Workbox, never made any sense in the first place. As such, we are getting rid of it and migrating to a design where types and validators are co-located with their related packages.
  - To migrate, update the imports:

    - `@serwist/build.WebpackPartial` -> `@serwist/webpack-plugin.WebpackPartial`
    - `@serwist/build.WebpackInjectManifestOptions` -> `@serwist/webpack-plugin.InjectManifestOptions`
    - `@serwist/build.WebpackInjectManifestPartial` -> `Omit<import("@serwist/webpack-plugin").InjectManifestOptions, keyof import("@serwist/build").BasePartial | keyof import("@serwist/build").InjectPartial | keyof import("@serwist/webpack-plugin").WebpackPartial | keyof import("@serwist/build").OptionalSwDestPartial>`
    - `@serwist/build.ViteInjectManifestOptions` -> `@serwist/vite.PluginOptions`

  - With this change, validators and schemas have also been made public. Validators can be imported from "/" files, whereas schemas can be imported from "/schema" ones.

### Patch Changes

- Updated dependencies [[`add4fdd`](https://github.com/serwist/serwist/commit/add4fdd390555053d023faebfe1dca41510b2e2f)]:
  - @serwist/webpack-plugin@9.0.0-preview.13
  - @serwist/build@9.0.0-preview.13
  - @serwist/core@9.0.0-preview.13
  - @serwist/expiration@9.0.0-preview.13
  - @serwist/range-requests@9.0.0-preview.13
  - @serwist/strategies@9.0.0-preview.13
  - @serwist/sw@9.0.0-preview.13
  - @serwist/window@9.0.0-preview.13

## 9.0.0-preview.12

### Patch Changes

- Updated dependencies [[`b273b8c`](https://github.com/serwist/serwist/commit/b273b8cd9a240f8bf8ba357339e2e2d5dc2e8870)]:
  - @serwist/sw@9.0.0-preview.12
  - @serwist/build@9.0.0-preview.12
  - @serwist/core@9.0.0-preview.12
  - @serwist/expiration@9.0.0-preview.12
  - @serwist/range-requests@9.0.0-preview.12
  - @serwist/strategies@9.0.0-preview.12
  - @serwist/webpack-plugin@9.0.0-preview.12
  - @serwist/window@9.0.0-preview.12

## 9.0.0-preview.11

### Major Changes

- [`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor: use iterables

  - Serwist now uses iterables in its code. For instance, `Headers.prototype.entries()` can be noticed at parts of `@serwist/cacheable-response`.
  - This is partly thanks to our Node.js requirement being bumped to 18.0.0. Iterables have been supported in all major browsers for ages, so they wouldn't be a problem (hell, all browsers that support service workers have support for iterables).
  - Still, since this requires us to enforce the use of Node.js 18.0.0 or later, it is marked a breaking change.

### Minor Changes

- [`4de5675`](https://github.com/serwist/serwist/commit/4de56759940875a217a1840261d45d5d46aeed77) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(webpack,next): allow webpack to be an optional `peerDependency`

  - Since we support frameworks that ship a prebundled webpack, such as Next.js, it would be nice if we can take advantage of that as well.

  - As a result, webpack is now an optional `peerDependency` for `@serwist/webpack-plugin` and is no longer a `peerDependency` for `@serwist/next`. Thanks to the fact that we currently don't use any webpack plugin, it is also not indirectly installed.

### Patch Changes

- Updated dependencies [[`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063), [`4de5675`](https://github.com/serwist/serwist/commit/4de56759940875a217a1840261d45d5d46aeed77)]:
  - @serwist/range-requests@9.0.0-preview.11
  - @serwist/webpack-plugin@9.0.0-preview.11
  - @serwist/expiration@9.0.0-preview.11
  - @serwist/strategies@9.0.0-preview.11
  - @serwist/window@9.0.0-preview.11
  - @serwist/build@9.0.0-preview.11
  - @serwist/core@9.0.0-preview.11
  - @serwist/sw@9.0.0-preview.11

## 9.0.0-preview.10

### Patch Changes

- [`4ad8533`](https://github.com/serwist/serwist/commit/4ad85338317f67bc0c8696ca98f6d7d9a1cf191a) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(next): removed `clean-webpack-plugin`

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.10
  - @serwist/core@9.0.0-preview.10
  - @serwist/expiration@9.0.0-preview.10
  - @serwist/range-requests@9.0.0-preview.10
  - @serwist/strategies@9.0.0-preview.10
  - @serwist/sw@9.0.0-preview.10
  - @serwist/webpack-plugin@9.0.0-preview.10
  - @serwist/window@9.0.0-preview.10

## 9.0.0-preview.9

### Patch Changes

- Updated dependencies [[`7e42ad9`](https://github.com/serwist/serwist/commit/7e42ad912d96fdda160a7aad9a5548e7c046bc27)]:
  - @serwist/strategies@9.0.0-preview.9
  - @serwist/sw@9.0.0-preview.9
  - @serwist/build@9.0.0-preview.9
  - @serwist/webpack-plugin@9.0.0-preview.9
  - @serwist/core@9.0.0-preview.9
  - @serwist/expiration@9.0.0-preview.9
  - @serwist/range-requests@9.0.0-preview.9
  - @serwist/window@9.0.0-preview.9

## 9.0.0-preview.8

### Patch Changes

- Updated dependencies [[`b1df273`](https://github.com/serwist/serwist/commit/b1df273379ee018fd850f962345740874c9fd54d)]:
  - @serwist/range-requests@9.0.0-preview.8
  - @serwist/expiration@9.0.0-preview.8
  - @serwist/strategies@9.0.0-preview.8
  - @serwist/core@9.0.0-preview.8
  - @serwist/build@9.0.0-preview.8
  - @serwist/sw@9.0.0-preview.8
  - @serwist/window@9.0.0-preview.8
  - @serwist/webpack-plugin@9.0.0-preview.8

## 9.0.0-preview.7

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.7
  - @serwist/core@9.0.0-preview.7
  - @serwist/expiration@9.0.0-preview.7
  - @serwist/range-requests@9.0.0-preview.7
  - @serwist/strategies@9.0.0-preview.7
  - @serwist/sw@9.0.0-preview.7
  - @serwist/webpack-plugin@9.0.0-preview.7
  - @serwist/window@9.0.0-preview.7

## 9.0.0-preview.6

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.6
  - @serwist/sw@9.0.0-preview.6
  - @serwist/webpack-plugin@9.0.0-preview.6
  - @serwist/core@9.0.0-preview.6
  - @serwist/expiration@9.0.0-preview.6
  - @serwist/range-requests@9.0.0-preview.6
  - @serwist/strategies@9.0.0-preview.6
  - @serwist/window@9.0.0-preview.6

## 9.0.0-preview.5

### Patch Changes

- Updated dependencies [[`dc12dda`](https://github.com/serwist/serwist/commit/dc12ddad60526db921b557f8dc5808ba17fc4d8e), [`dc12dda`](https://github.com/serwist/serwist/commit/dc12ddad60526db921b557f8dc5808ba17fc4d8e)]:
  - @serwist/webpack-plugin@9.0.0-preview.5
  - @serwist/sw@9.0.0-preview.5
  - @serwist/build@9.0.0-preview.5
  - @serwist/core@9.0.0-preview.5
  - @serwist/expiration@9.0.0-preview.5
  - @serwist/range-requests@9.0.0-preview.5
  - @serwist/strategies@9.0.0-preview.5
  - @serwist/window@9.0.0-preview.5

## 9.0.0-preview.4

### Major Changes

- [`7524712`](https://github.com/serwist/serwist/commit/75247128031de3067676b08b21833b5d2e1d1f14) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(next): changed `defaultCache`'s `"next-data"`'s handler to NetworkFirst

  - Using `StaleWhileRevalidate` seems to affect `getServerSideProps`. See https://github.com/serwist/serwist/issues/74 for more details.

  - There's nothing to be done on your side.

### Patch Changes

- Updated dependencies [[`6c3e789`](https://github.com/serwist/serwist/commit/6c3e789724533dab23a6f5afb2a0f40d8f26bf16)]:
  - @serwist/sw@9.0.0-preview.4
  - @serwist/build@9.0.0-preview.4
  - @serwist/webpack-plugin@9.0.0-preview.4
  - @serwist/core@9.0.0-preview.4
  - @serwist/expiration@9.0.0-preview.4
  - @serwist/range-requests@9.0.0-preview.4
  - @serwist/strategies@9.0.0-preview.4
  - @serwist/window@9.0.0-preview.4

## 9.0.0-preview.3

### Patch Changes

- Updated dependencies [[`10c3c17`](https://github.com/serwist/serwist/commit/10c3c17a0021c87886c47c2588d8beca1cb21535)]:
  - @serwist/sw@9.0.0-preview.3
  - @serwist/build@9.0.0-preview.3
  - @serwist/core@9.0.0-preview.3
  - @serwist/expiration@9.0.0-preview.3
  - @serwist/range-requests@9.0.0-preview.3
  - @serwist/strategies@9.0.0-preview.3
  - @serwist/webpack-plugin@9.0.0-preview.3
  - @serwist/window@9.0.0-preview.3

## 9.0.0-preview.2

### Patch Changes

- Updated dependencies [[`85bc781`](https://github.com/serwist/serwist/commit/85bc7812ed38f52bb04bbc79333950beafa75e42)]:
  - @serwist/sw@9.0.0-preview.2
  - @serwist/build@9.0.0-preview.2
  - @serwist/core@9.0.0-preview.2
  - @serwist/webpack-plugin@9.0.0-preview.2
  - @serwist/window@9.0.0-preview.2

## 9.0.0-preview.1

### Major Changes

- [`837cd0d`](https://github.com/serwist/serwist/commit/837cd0d7caaa03e0d3334bbf707ac9147a844285) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(next): renamed `cacheOnFrontEndNav` to `cacheOnNavigation`

  - I intended to make this breaking change in 8.0.0, but forgot. To clarify, generally, we avoids abbreviations (except for acronyms) when naming our APIs.
  - To migrate, simply replace `cacheOnFrontEndNav` with `cacheOnNavigation`:

    - Old:

    ```js
    const withSerwist = withSerwistInit({
      cacheOnFrontEndNav: true,
    });

    /** @type {import("next").NextConfig} */
    const nextConfig = {};

    export default withSerwist(nextConfig);
    ```

    - New:

    ```js
    const withSerwist = withSerwistInit({
      cacheOnNavigation: true,
    });

    /** @type {import("next").NextConfig} */
    const nextConfig = {};

    export default withSerwist(nextConfig);
    ```

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.1
  - @serwist/core@9.0.0-preview.1
  - @serwist/sw@9.0.0-preview.1
  - @serwist/webpack-plugin@9.0.0-preview.1
  - @serwist/window@9.0.0-preview.1

## 9.0.0-preview.0

### Major Changes

- [`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(next): renamed /browser to /worker

  - This new name makes more sense than the old one, for these exports are actually for use in service workers.
  - To migrate, simply change all imports of `@serwist/next/browser` to those of `@serwist/next/worker`:

    - Old:

    ```ts
    import { defaultCache } from "@serwist/next/browser";

    installSerwist({
      // Other options
      runtimeCaching: defaultCache,
    });
    ```

    - New:

    ```ts
    import { defaultCache } from "@serwist/next/worker";

    installSerwist({
      // Other options
      runtimeCaching: defaultCache,
    });
    ```

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

### Minor Changes

- [`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(next): added `@serwist/next/worker.definePageRuntimeCaching`

  - Due to the fact that App Router pages use RSC, we define 3 `runtimeCaching` entries in `defaultCache`, which are `"pages-rsc-prefetch"`, `"pages-rsc"`, and `"pages"`. However, if an user were to extend this `runtimeCaching` array with their own pages entries, they would have to copy this from `defaultCache`, requiring them to inspect the source code. This method was added so that the user can conveniently do the same without the hassle.

### Patch Changes

- Updated dependencies [[`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459), [`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58), [`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459), [`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58), [`04d2619`](https://github.com/serwist/serwist/commit/04d26194b19936ba0425bf7b7e6c5e2ca9183813)]:
  - @serwist/build@9.0.0-preview.0
  - @serwist/webpack-plugin@9.0.0-preview.0
  - @serwist/core@9.0.0-preview.0
  - @serwist/sw@9.0.0-preview.0
  - @serwist/window@9.0.0-preview.0

## 8.4.4

### Patch Changes

- [#56](https://github.com/serwist/serwist/pull/56) [`905e827`](https://github.com/serwist/serwist/commit/905e8278af5c8340df8dcf8018e143ad37442477) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(next): fixed invalid precache manifest being generated when `basePath` is set

  - This is caused by "/\_next/../public" in `modifyURLPrefix` not being matched when `basePath` is set, since the URL is actually "${basePath}/\_next/../public/\*\*/\*".
  - We now use `manifestTransforms` instead of `modifyURLPrefix`.

- Updated dependencies []:
  - @serwist/build@8.4.4
  - @serwist/webpack-plugin@8.4.4
  - @serwist/window@8.4.4

## 8.4.3

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.4.3
  - @serwist/webpack-plugin@8.4.3
  - @serwist/window@8.4.3

## 8.4.2

### Patch Changes

- [`e454e63`](https://github.com/serwist/serwist/commit/e454e63d66967b3b02355666796596dfe5a5f785) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(next): fixed `additionalPrecacheEntries` not having a default

  - This is an age-old bug of `@ducanh2912/next-pwa` caused by an extra `?? []`, which results in the nullish check following the declaration to always be `false`.

- Updated dependencies []:
  - @serwist/build@8.4.2
  - @serwist/webpack-plugin@8.4.2
  - @serwist/window@8.4.2

## 8.4.1

### Patch Changes

- Updated dependencies [[`d45c7a3`](https://github.com/serwist/serwist/commit/d45c7a3e62cd98eab3110038f3f90240bd5e6831)]:
  - @serwist/build@8.4.1
  - @serwist/webpack-plugin@8.4.1
  - @serwist/window@8.4.1

## 8.4.0

### Patch Changes

- [#32](https://github.com/serwist/serwist/pull/32) [`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(docs): changed docs's URL

  - Currently we deploy at Cloudflare Pages.

- Updated dependencies [[`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d)]:
  - @serwist/webpack-plugin@8.4.0
  - @serwist/window@8.4.0
  - @serwist/build@8.4.0

## 8.3.0

### Patch Changes

- [`bd75087`](https://github.com/serwist/serwist/commit/bd7508722a50bc2191d24a1e6e55a835060ba350) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(cjs): fixed CommonJS builds crashing

  - Turns out we also need `chunkFileNames`, otherwise Rollup would always use ".js" for all the chunks. What in the world.

- Updated dependencies [[`0bb9635`](https://github.com/serwist/serwist/commit/0bb96358f7574b80fac060b0d8208528f8d92ff8), [`bd75087`](https://github.com/serwist/serwist/commit/bd7508722a50bc2191d24a1e6e55a835060ba350)]:
  - @serwist/window@8.3.0
  - @serwist/webpack-plugin@8.3.0
  - @serwist/build@8.3.0

## 8.2.0

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.2.0
  - @serwist/webpack-plugin@8.2.0
  - @serwist/window@8.2.0

## 8.1.1

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.1.1
  - @serwist/webpack-plugin@8.1.1
  - @serwist/window@8.1.1

## 8.1.0

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.1.0
  - @serwist/webpack-plugin@8.1.0
  - @serwist/window@8.1.0

## 8.0.5

### Patch Changes

- Updated dependencies [[`beec2d1`](https://github.com/serwist/serwist/commit/beec2d1d4bf1747acc15567e9accab68e37980cc)]:
  - @serwist/webpack-plugin@8.0.5
  - @serwist/build@8.0.5
  - @serwist/window@8.0.5

## 8.0.4

### Patch Changes

- [#10](https://github.com/serwist/serwist/pull/10) [`52edfe2`](https://github.com/serwist/serwist/commit/52edfe2f9e4ff2007747dd038023dbc94af52698) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(node-16-cjs): added type support for NodeNext with CommonJS

  - The "fix" is really simple - we copy `.d.ts` to `.old.d.cts` 💀
  - This also fixes the issue where using `@serwist/build`, `@serwist/webpack-plugin`, and their dependents with CommonJS crashes due to us using `pretty-bytes`, which is an ESM package.

- Updated dependencies [[`52edfe2`](https://github.com/serwist/serwist/commit/52edfe2f9e4ff2007747dd038023dbc94af52698)]:
  - @serwist/webpack-plugin@8.0.4
  - @serwist/window@8.0.4
  - @serwist/build@8.0.4

## 8.0.3

### Patch Changes

- Updated dependencies [[`22bc8a8`](https://github.com/serwist/serwist/commit/22bc8a86e14873d8fc335c3ea4db11f46e91aa07)]:
  - @serwist/build@8.0.3
  - @serwist/webpack-plugin@8.0.3
  - @serwist/window@8.0.3

## 8.0.2

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.0.2
  - @serwist/webpack-plugin@8.0.2
  - @serwist/window@8.0.2

## 8.0.1

### Patch Changes

- [`15fb388`](https://github.com/serwist/serwist/commit/15fb38839a5b3b06bdaa39994fba29b56d05b301) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(publish): removed declarations map

- Updated dependencies [[`15fb388`](https://github.com/serwist/serwist/commit/15fb38839a5b3b06bdaa39994fba29b56d05b301)]:
  - @serwist/build@8.0.1
  - @serwist/core@8.0.1
  - @serwist/webpack-plugin@8.0.1
  - @serwist/window@8.0.1

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
  - @serwist/webpack-plugin@8.0.0
  - @serwist/window@8.0.0
  - @serwist/build@8.0.0
  - @serwist/core@8.0.0
