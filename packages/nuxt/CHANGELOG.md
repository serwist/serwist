# @serwist/nuxt

## 9.2.3

### Patch Changes

- [`01f4b27`](https://github.com/serwist/serwist/commit/01f4b27152fd6fc4a9f5a39cc5636047a06346d0) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): dependencies maintenance

  - This patch updates all dependencies and bumps `glob` to fix a vulnerability.

- Updated dependencies [[`01f4b27`](https://github.com/serwist/serwist/commit/01f4b27152fd6fc4a9f5a39cc5636047a06346d0)]:
  - @serwist/build@9.2.3
  - @serwist/vite@9.2.3
  - @serwist/window@9.2.3

## 9.2.2

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.2.2
  - @serwist/window@9.2.2
  - @serwist/build@9.2.2

## 9.2.1

### Patch Changes

- [`66075d2`](https://github.com/serwist/serwist/commit/66075d22c0ff64193c73c09ecddf98731cc6b39c) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(nuxt): fixed `swDest` not working as expected when not set to an absolute path

  - `swDest` should now be resolved relative to .output/public when it is not absolute path.
  - Previously, setting a relative path would cause the service worker to not be included in the output, as it would be bundled to an unspecified location.

- [`66075d2`](https://github.com/serwist/serwist/commit/66075d22c0ff64193c73c09ecddf98731cc6b39c) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(nuxt): fixed `globPatterns` not using default glob patterns when `undefined`

  - When `globPatterns` is `undefined`, `@serwist/nuxt` should now set it to Serwist's default glob patterns.
  - This bug was previously caused by `@serwist/nuxt` having its own `globPatterns`, leading to the default glob patterns not being added via `@serwist/build`'s Zod schema.

- Updated dependencies []:
  - @serwist/build@9.2.1
  - @serwist/vite@9.2.1
  - @serwist/window@9.2.1

## 9.2.0

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.2.0
  - @serwist/window@9.2.0
  - @serwist/build@9.2.0

## 9.1.1

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.1.1
  - @serwist/vite@9.1.1
  - @serwist/window@9.1.1

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

- [`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(nuxt): added Nuxt 4 compatibility

  - `@serwist/nuxt` now supports Nuxt 4.
  - If you're using Nuxt, you can expect to simply migrate to Nuxt 4 without Serwist causing troubles.

- [`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95), [`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95)]:
  - @serwist/window@9.1.0
  - @serwist/build@9.1.0
  - @serwist/vite@9.1.0

## 9.0.15

### Patch Changes

- [`de27be5`](https://github.com/serwist/serwist/commit/de27be5c8c48afc6122e046dc116696cedfc93e4) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

  - Just the regular stuff. Serwist 10 is still on the way!

- [`de27be5`](https://github.com/serwist/serwist/commit/de27be5c8c48afc6122e046dc116696cedfc93e4) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix: prefer `nitro.static` over `_generate`

  - Thanks @danielroe! Here's the PR message:

  Since nuxi v3.8, we've supported setting `nuxt.options.nitro.static` instead of `nuxt.options._generate` (which is an internal flag) - see https://github.com/nuxt/nuxt/pull/21860.

  Now, in preparation for Nuxt v4, we've removed the types for `_generate` (see https://github.com/nuxt/nuxt/pull/32355). This PR adds support for new version in backwards compatible way (ignoring type issues) - I'd suggest you remove support in a future major.

- Updated dependencies [[`de27be5`](https://github.com/serwist/serwist/commit/de27be5c8c48afc6122e046dc116696cedfc93e4)]:
  - @serwist/window@9.0.15
  - @serwist/build@9.0.15
  - @serwist/vite@9.0.15

## 9.0.14

### Patch Changes

- Updated dependencies [[`b67b551`](https://github.com/serwist/serwist/commit/b67b55116e9fc8d4ce02593c2095bd1555270488)]:
  - @serwist/vite@9.0.14
  - @serwist/build@9.0.14
  - @serwist/window@9.0.14

## 9.0.11

### Patch Changes

- [`cdefdc3`](https://github.com/serwist/serwist/commit/cdefdc32247f45a553a7a7ce4ff549fdf04290ce) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`cdefdc3`](https://github.com/serwist/serwist/commit/cdefdc32247f45a553a7a7ce4ff549fdf04290ce)]:
  - @serwist/window@9.0.11
  - @serwist/build@9.0.11
  - @serwist/vite@9.0.11

## 9.0.10

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.10
  - @serwist/vite@9.0.10
  - @serwist/window@9.0.10

## 9.0.9

### Patch Changes

- Updated dependencies [[`c19cc79`](https://github.com/serwist/serwist/commit/c19cc79bda805d1ca3d3bfa62f5c712fde54ab7f)]:
  - @serwist/build@9.0.9
  - @serwist/vite@9.0.9
  - @serwist/window@9.0.9

## 9.0.8

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.0.8
  - @serwist/window@9.0.8
  - @serwist/build@9.0.8

## 9.0.7

### Patch Changes

- [#192](https://github.com/serwist/serwist/pull/192) [`ceea5d1`](https://github.com/serwist/serwist/commit/ceea5d1d56dfec9b3aafba41bd0b0f2916a4ac17) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(build): remove extraneous Node.js API wrappers

  - Doesn't seem that we really need `fs-extra`, `pathe`, `fast-json-stable-stringify`, or `upath`, so let's just remove them.
  - This also adds tests for Windows to ensure that we don't mess up.

- Updated dependencies [[`ceea5d1`](https://github.com/serwist/serwist/commit/ceea5d1d56dfec9b3aafba41bd0b0f2916a4ac17)]:
  - @serwist/build@9.0.7
  - @serwist/vite@9.0.7
  - @serwist/window@9.0.7

## 9.0.6

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.0.6
  - @serwist/window@9.0.6
  - @serwist/build@9.0.6

## 9.0.5

### Patch Changes

- Updated dependencies [[`c7bed2b`](https://github.com/serwist/serwist/commit/c7bed2b3a16be9b60cbb485500a3e893615f321d)]:
  - @serwist/build@9.0.5
  - @serwist/vite@9.0.5
  - @serwist/window@9.0.5

## 9.0.4

### Patch Changes

- [`db66e96`](https://github.com/serwist/serwist/commit/db66e96cb7fd8857200efc261d60cffaca1c0177) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`db66e96`](https://github.com/serwist/serwist/commit/db66e96cb7fd8857200efc261d60cffaca1c0177)]:
  - @serwist/window@9.0.4
  - @serwist/build@9.0.4
  - @serwist/vite@9.0.4

## 9.0.3

### Patch Changes

- [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): updated all dependencies

  - We have updated all dependencies to latest, as usual.

- [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(frameworks): use `NetworkOnly` for `defaultCache` in dev

  - If we set `runtimeCaching` to an empty array, all preload responses are discarded, causing certain browsers to log a certain error message. This change fixes that error for developers using `defaultCache` in development mode.

- Updated dependencies [[`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed), [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed)]:
  - @serwist/window@9.0.3
  - @serwist/build@9.0.3
  - @serwist/vite@9.0.3

## 9.0.2

### Patch Changes

- Updated dependencies [[`693679a`](https://github.com/serwist/serwist/commit/693679a2b9fc066d4636974039131fd48bfb9b28)]:
  - @serwist/vite@9.0.2
  - @serwist/build@9.0.2
  - @serwist/window@9.0.2

## 9.0.1

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.1
  - @serwist/vite@9.0.1
  - @serwist/window@9.0.1

## 9.0.0

### Major Changes

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

### Patch Changes

- Updated dependencies [[`add4fdd`](https://github.com/serwist/serwist/commit/add4fdd390555053d023faebfe1dca41510b2e2f), [`691ef0d`](https://github.com/serwist/serwist/commit/691ef0d706a47bacd8c45b8e569669af76535766), [`db9f327`](https://github.com/serwist/serwist/commit/db9f3275cd2f78287516668b50a62cff7c1a4d1d), [`7b55ac5`](https://github.com/serwist/serwist/commit/7b55ac526a73826cb2d179a863d7eb29182616ee), [`4a5d51a`](https://github.com/serwist/serwist/commit/4a5d51ac8e9ed97b97754d8164990a08be65846d), [`7b55ac5`](https://github.com/serwist/serwist/commit/7b55ac526a73826cb2d179a863d7eb29182616ee), [`db7776e`](https://github.com/serwist/serwist/commit/db7776e6f55f4d1cf62ea8975c8460cb92c28138)]:
  - @serwist/build@9.0.0
  - @serwist/vite@9.0.0
  - @serwist/window@9.0.0

## 9.0.0-preview.26

### Patch Changes

- [`3a16582`](https://github.com/serwist/serwist/commit/3a165826cd07bb02f2cd2a8a7bedaf7c2bbeaed5) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: second stability test before stable release

- Updated dependencies [[`3a16582`](https://github.com/serwist/serwist/commit/3a165826cd07bb02f2cd2a8a7bedaf7c2bbeaed5)]:
  - @serwist/window@9.0.0-preview.26
  - @serwist/build@9.0.0-preview.26
  - @serwist/vite@9.0.0-preview.26

## 9.0.0-preview.25

### Patch Changes

- [`7e00b79`](https://github.com/serwist/serwist/commit/7e00b79d3888fcdd0b2ac0c2cf5060b9cf91a9ea) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: stability test before stable release

- Updated dependencies [[`7e00b79`](https://github.com/serwist/serwist/commit/7e00b79d3888fcdd0b2ac0c2cf5060b9cf91a9ea)]:
  - @serwist/window@9.0.0-preview.25
  - @serwist/build@9.0.0-preview.25
  - @serwist/vite@9.0.0-preview.25

## 9.0.0-preview.24

### Patch Changes

- @serwist/vite@9.0.0-preview.24
- @serwist/window@9.0.0-preview.24
- @serwist/build@9.0.0-preview.24

## 9.0.0-preview.23

### Patch Changes

- Updated dependencies [e30e2eb]
  - @serwist/window@9.0.0-preview.23
  - @serwist/vite@9.0.0-preview.23
  - @serwist/build@9.0.0-preview.23

## 9.0.0-preview.22

### Patch Changes

- Updated dependencies
  - @serwist/window@9.0.0-preview.22
  - @serwist/vite@9.0.0-preview.22
  - @serwist/build@9.0.0-preview.22

## 9.0.0-preview.21

### Patch Changes

- Updated dependencies [6ed7da2]
- Updated dependencies
  - @serwist/window@9.0.0-preview.21
  - @serwist/vite@9.0.0-preview.21
  - @serwist/build@9.0.0-preview.21

## 9.0.0-preview.20

### Patch Changes

- @serwist/vite@9.0.0-preview.20
- @serwist/build@9.0.0-preview.20
- @serwist/window@9.0.0-preview.20

## 9.0.0-preview.19

### Patch Changes

- 6d294f9: refactor: migrate to GitLab

  - Serwist and `@ducanh2912/next-pwa` have migrated to GitLab.
  - This was the result of GitHub flagging my account, organizations, and repositories as spam. Sorry for the inconvenience.

- Updated dependencies [6d294f9]
  - @serwist/window@9.0.0-preview.19
  - @serwist/build@9.0.0-preview.19
  - @serwist/vite@9.0.0-preview.19

## 9.0.0-preview.18

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.0.0-preview.18
  - @serwist/build@9.0.0-preview.18
  - @serwist/window@9.0.0-preview.18

## 9.0.0-preview.17

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.0.0-preview.17
  - @serwist/build@9.0.0-preview.17
  - @serwist/window@9.0.0-preview.17

## 9.0.0-preview.16

### Patch Changes

- Updated dependencies [[`db7776e`](https://github.com/serwist/serwist/commit/db7776e6f55f4d1cf62ea8975c8460cb92c28138)]:
  - @serwist/vite@9.0.0-preview.16
  - @serwist/build@9.0.0-preview.16
  - @serwist/window@9.0.0-preview.16

## 9.0.0-preview.15

### Patch Changes

- Updated dependencies []:
  - @serwist/vite@9.0.0-preview.15
  - @serwist/build@9.0.0-preview.15
  - @serwist/window@9.0.0-preview.15

## 9.0.0-preview.14

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.14
  - @serwist/vite@9.0.0-preview.14
  - @serwist/window@9.0.0-preview.14

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
