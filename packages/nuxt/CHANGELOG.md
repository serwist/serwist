# @serwist/nuxt

## 9.0.0-preview.13

### Patch Changes

- Updated dependencies [[`add4fdd`](https://github.com/serwist/serwist/commit/add4fdd390555053d023faebfe1dca41510b2e2f)]:
  - @serwist/build@9.0.0-preview.13
  - @serwist/vite@9.0.0-preview.13
  - @serwist/window@9.0.0-preview.13

## 9.0.0-preview.12

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.0.0-preview.12
  - @serwist/build@9.0.0-preview.12
  - @serwist/window@9.0.0-preview.12

## 9.0.0-preview.11

### Major Changes

- [`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor: use iterables

  - Serwist now uses iterables in its code. For instance, `Headers.prototype.entries()` can be noticed at parts of `@serwist/cacheable-response`.
  - This is partly thanks to our Node.js requirement being bumped to 18.0.0. Iterables have been supported in all major browsers for ages, so they wouldn't be a problem (hell, all browsers that support service workers have support for iterables).
  - Still, since this requires us to enforce the use of Node.js 18.0.0 or later, it is marked a breaking change.

### Patch Changes

- Updated dependencies [[`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063)]:
  - @serwist/window@9.0.0-preview.11
  - @serwist/build@9.0.0-preview.11
  - @serwist/vite@9.0.0-preview.11

## 9.0.0-preview.10

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.10
  - @serwist/vite@9.0.0-preview.10
  - @serwist/window@9.0.0-preview.10

## 9.0.0-preview.9

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.0.0-preview.9
  - @serwist/build@9.0.0-preview.9
  - @serwist/window@9.0.0-preview.9

## 9.0.0-preview.8

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.8
  - @serwist/vite@9.0.0-preview.8
  - @serwist/window@9.0.0-preview.8

## 9.0.0-preview.7

### Patch Changes

- Updated dependencies [[`db9f327`](https://github.com/serwist/serwist/commit/db9f3275cd2f78287516668b50a62cff7c1a4d1d)]:
  - @serwist/vite@9.0.0-preview.7
  - @serwist/build@9.0.0-preview.7
  - @serwist/window@9.0.0-preview.7

## 9.0.0-preview.6

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.6
  - @serwist/vite@9.0.0-preview.6
  - @serwist/window@9.0.0-preview.6

## 9.0.0-preview.5

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.5
  - @serwist/vite@9.0.0-preview.5
  - @serwist/window@9.0.0-preview.5

## 9.0.0-preview.4

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.4
  - @serwist/vite@9.0.0-preview.4
  - @serwist/window@9.0.0-preview.4

## 9.0.0-preview.3

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.0.0-preview.3
  - @serwist/build@9.0.0-preview.3
  - @serwist/window@9.0.0-preview.3

## 9.0.0-preview.2

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.0.0-preview.2
  - @serwist/build@9.0.0-preview.2
  - @serwist/window@9.0.0-preview.2

## 9.0.0-preview.1

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.1
  - @serwist/vite@9.0.0-preview.1
  - @serwist/window@9.0.0-preview.1

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

### Patch Changes

- Updated dependencies [[`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459), [`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58), [`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459)]:
  - @serwist/build@9.0.0-preview.0
  - @serwist/vite@9.0.0-preview.0
  - @serwist/window@9.0.0-preview.0

## 8.4.4

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.4.4
  - @serwist/vite@8.4.4
  - @serwist/window@8.4.4

## 8.4.3

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.4.3
  - @serwist/vite@8.4.3
  - @serwist/window@8.4.3

## 8.4.2

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.4.2
  - @serwist/vite@8.4.2
  - @serwist/window@8.4.2

## 8.4.1

### Patch Changes

- Updated dependencies [[`d45c7a3`](https://github.com/serwist/serwist/commit/d45c7a3e62cd98eab3110038f3f90240bd5e6831)]:
  - @serwist/build@8.4.1
  - @serwist/vite@8.4.1
  - @serwist/window@8.4.1

## 8.4.0

### Minor Changes

- [#32](https://github.com/serwist/serwist/pull/32) [`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - feat(nuxt): release `@serwist/nuxt`

  - A fork of vite-pwa/nuxt.

### Patch Changes

- [#32](https://github.com/serwist/serwist/pull/32) [`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(docs): changed docs's URL

  - Currently we deploy at Cloudflare Pages.

- Updated dependencies [[`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d), [`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d)]:
  - @serwist/window@8.4.0
  - @serwist/build@8.4.0
  - @serwist/vite@8.4.0
