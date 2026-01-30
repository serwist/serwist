# @serwist/utils

## 9.5.0

## 9.4.4

## 9.4.3

## 9.4.2

## 9.4.1

## 9.4.0

## 9.3.1

## 9.3.0

## 9.2.3

### Patch Changes

- [`01f4b27`](https://github.com/serwist/serwist/commit/01f4b27152fd6fc4a9f5a39cc5636047a06346d0) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): dependencies maintenance
  - This patch updates all dependencies and bumps `glob` to fix a vulnerability.

## 9.2.2

## 9.2.1

## 9.2.0

## 9.1.1

## 9.1.0

### Patch Changes

- [`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

## 9.0.15

## 9.0.14

## 9.0.11

## 9.0.10

## 9.0.9

## 9.0.8

## 9.0.7

## 9.0.6

## 9.0.5

## 9.0.4

## 9.0.3

## 9.0.2

## 9.0.1

## 9.0.0

### Major Changes

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
