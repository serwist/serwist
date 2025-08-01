# @serwist/build

## 9.1.1

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

## 9.0.15

### Patch Changes

- [`de27be5`](https://github.com/serwist/serwist/commit/de27be5c8c48afc6122e046dc116696cedfc93e4) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

  - Just the regular stuff. Serwist 10 is still on the way!

## 9.0.14

## 9.0.11

### Patch Changes

- [`cdefdc3`](https://github.com/serwist/serwist/commit/cdefdc32247f45a553a7a7ce4ff549fdf04290ce) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

## 9.0.10

## 9.0.9

### Patch Changes

- [`c19cc79`](https://github.com/serwist/serwist/commit/c19cc79bda805d1ca3d3bfa62f5c712fde54ab7f) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(build): updated `rollup`

  - There was a [high severity vulnerability](https://github.com/advisories/GHSA-gcx4-mw62-g8wm) for `rollup`.
  - `rollup` has also been moved to `devDependencies` for `@serwist/build`.

## 9.0.8

## 9.0.7

### Patch Changes

- [#192](https://github.com/serwist/serwist/pull/192) [`ceea5d1`](https://github.com/serwist/serwist/commit/ceea5d1d56dfec9b3aafba41bd0b0f2916a4ac17) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(build): remove extraneous Node.js API wrappers

  - Doesn't seem that we really need `fs-extra`, `pathe`, `fast-json-stable-stringify`, or `upath`, so let's just remove them.
  - This also adds tests for Windows to ensure that we don't mess up.

## 9.0.6

## 9.0.5

### Patch Changes

- [#168](https://github.com/serwist/serwist/pull/168) [`c7bed2b`](https://github.com/serwist/serwist/commit/c7bed2b3a16be9b60cbb485500a3e893615f321d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(dependencies): reverted `glob` to v10 and `rimraf` to v5

  - Turns out `glob` v11 and `rimraf` v6 drops support for Node.js 18, so we are back to v10 and v5 for now.
  - This also adds test for Node.js 18 and 22.

## 9.0.4

### Patch Changes

- [`db66e96`](https://github.com/serwist/serwist/commit/db66e96cb7fd8857200efc261d60cffaca1c0177) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

## 9.0.3

### Patch Changes

- [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): updated all dependencies

  - We have updated all dependencies to latest, as usual.

## 9.0.2

## 9.0.1

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

- [#123](https://github.com/serwist/serwist/pull/123) [`7b55ac5`](https://github.com/serwist/serwist/commit/7b55ac526a73826cb2d179a863d7eb29182616ee) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(validators): migrate to Zod

  - We now use Zod instead of AJV.
  - This allows us to further validate the values, as AJV didn't support validating functions, classes, and more.
  - Usually, you don't need to do anything. However, if you manipulate the log/error message to do something wicked, you may need to adapt to the new format:

  ```
  Received an invalid Serwist configuration: {
    "_errors": [
      "Received unrecognized keys: someInvalidKey"
    ],
    "additionalPrecacheEntries": {
      "_errors": [
        "Received invalid type: expected array, received string."
      ]
    }
  }
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

## 9.0.0-preview.26

### Patch Changes

- [`3a16582`](https://github.com/serwist/serwist/commit/3a165826cd07bb02f2cd2a8a7bedaf7c2bbeaed5) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: second stability test before stable release

## 9.0.0-preview.25

### Patch Changes

- [`7e00b79`](https://github.com/serwist/serwist/commit/7e00b79d3888fcdd0b2ac0c2cf5060b9cf91a9ea) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: stability test before stable release

## 9.0.0-preview.24

## 9.0.0-preview.23

### Patch Changes

- @serwist/core@9.0.0-preview.23

## 9.0.0-preview.22

### Patch Changes

- @serwist/core@9.0.0-preview.22

## 9.0.0-preview.21

### Patch Changes

- @serwist/core@9.0.0-preview.21

## 9.0.0-preview.20

### Patch Changes

- @serwist/core@9.0.0-preview.20

## 9.0.0-preview.19

### Patch Changes

- 6d294f9: refactor: migrate to GitLab

  - Serwist and `@ducanh2912/next-pwa` have migrated to GitLab.
  - This was the result of GitHub flagging my account, organizations, and repositories as spam. Sorry for the inconvenience.

- Updated dependencies [6d294f9]
  - @serwist/core@9.0.0-preview.19

## 9.0.0-preview.18

### Patch Changes

- Updated dependencies []:
  - @serwist/core@9.0.0-preview.18

## 9.0.0-preview.17

### Patch Changes

- Updated dependencies []:
  - @serwist/core@9.0.0-preview.17

## 9.0.0-preview.16

### Patch Changes

- Updated dependencies []:
  - @serwist/core@9.0.0-preview.16

## 9.0.0-preview.15

### Patch Changes

- Updated dependencies []:
  - @serwist/core@9.0.0-preview.15

## 9.0.0-preview.14

### Patch Changes

- Updated dependencies []:
  - @serwist/core@9.0.0-preview.14

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

- Updated dependencies []:
  - @serwist/core@9.0.0-preview.13

## 9.0.0-preview.12

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.12
  - @serwist/broadcast-update@9.0.0-preview.12
  - @serwist/cacheable-response@9.0.0-preview.12
  - @serwist/core@9.0.0-preview.12
  - @serwist/expiration@9.0.0-preview.12
  - @serwist/google-analytics@9.0.0-preview.12
  - @serwist/precaching@9.0.0-preview.12
  - @serwist/routing@9.0.0-preview.12

## 9.0.0-preview.11

### Major Changes

- [`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor: use iterables

  - Serwist now uses iterables in its code. For instance, `Headers.prototype.entries()` can be noticed at parts of `@serwist/cacheable-response`.
  - This is partly thanks to our Node.js requirement being bumped to 18.0.0. Iterables have been supported in all major browsers for ages, so they wouldn't be a problem (hell, all browsers that support service workers have support for iterables).
  - Still, since this requires us to enforce the use of Node.js 18.0.0 or later, it is marked a breaking change.

### Patch Changes

- Updated dependencies [[`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063), [`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063)]:
  - @serwist/cacheable-response@9.0.0-preview.11
  - @serwist/broadcast-update@9.0.0-preview.11
  - @serwist/google-analytics@9.0.0-preview.11
  - @serwist/background-sync@9.0.0-preview.11
  - @serwist/expiration@9.0.0-preview.11
  - @serwist/precaching@9.0.0-preview.11
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
  - @serwist/precaching@9.0.0-preview.10
  - @serwist/routing@9.0.0-preview.10

## 9.0.0-preview.9

### Patch Changes

- Updated dependencies []:
  - @serwist/google-analytics@9.0.0-preview.9
  - @serwist/precaching@9.0.0-preview.9
  - @serwist/background-sync@9.0.0-preview.9
  - @serwist/broadcast-update@9.0.0-preview.9
  - @serwist/cacheable-response@9.0.0-preview.9
  - @serwist/core@9.0.0-preview.9
  - @serwist/expiration@9.0.0-preview.9
  - @serwist/routing@9.0.0-preview.9

## 9.0.0-preview.8

### Patch Changes

- Updated dependencies [[`b1df273`](https://github.com/serwist/serwist/commit/b1df273379ee018fd850f962345740874c9fd54d)]:
  - @serwist/cacheable-response@9.0.0-preview.8
  - @serwist/broadcast-update@9.0.0-preview.8
  - @serwist/google-analytics@9.0.0-preview.8
  - @serwist/background-sync@9.0.0-preview.8
  - @serwist/expiration@9.0.0-preview.8
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
  - @serwist/precaching@9.0.0-preview.7
  - @serwist/routing@9.0.0-preview.7

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
  - @serwist/routing@9.0.0-preview.6

## 9.0.0-preview.5

### Patch Changes

- Updated dependencies [[`dc12dda`](https://github.com/serwist/serwist/commit/dc12ddad60526db921b557f8dc5808ba17fc4d8e)]:
  - @serwist/google-analytics@9.0.0-preview.5
  - @serwist/background-sync@9.0.0-preview.5
  - @serwist/broadcast-update@9.0.0-preview.5
  - @serwist/cacheable-response@9.0.0-preview.5
  - @serwist/core@9.0.0-preview.5
  - @serwist/expiration@9.0.0-preview.5
  - @serwist/precaching@9.0.0-preview.5
  - @serwist/routing@9.0.0-preview.5

## 9.0.0-preview.4

### Patch Changes

- Updated dependencies [[`6c3e789`](https://github.com/serwist/serwist/commit/6c3e789724533dab23a6f5afb2a0f40d8f26bf16)]:
  - @serwist/precaching@9.0.0-preview.4
  - @serwist/background-sync@9.0.0-preview.4
  - @serwist/broadcast-update@9.0.0-preview.4
  - @serwist/cacheable-response@9.0.0-preview.4
  - @serwist/core@9.0.0-preview.4
  - @serwist/expiration@9.0.0-preview.4
  - @serwist/google-analytics@9.0.0-preview.4
  - @serwist/routing@9.0.0-preview.4

## 9.0.0-preview.3

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.3
  - @serwist/broadcast-update@9.0.0-preview.3
  - @serwist/cacheable-response@9.0.0-preview.3
  - @serwist/core@9.0.0-preview.3
  - @serwist/expiration@9.0.0-preview.3
  - @serwist/google-analytics@9.0.0-preview.3
  - @serwist/precaching@9.0.0-preview.3
  - @serwist/routing@9.0.0-preview.3

## 9.0.0-preview.2

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.2
  - @serwist/broadcast-update@9.0.0-preview.2
  - @serwist/cacheable-response@9.0.0-preview.2
  - @serwist/core@9.0.0-preview.2
  - @serwist/expiration@9.0.0-preview.2
  - @serwist/google-analytics@9.0.0-preview.2
  - @serwist/precaching@9.0.0-preview.2
  - @serwist/routing@9.0.0-preview.2

## 9.0.0-preview.1

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@9.0.0-preview.1
  - @serwist/broadcast-update@9.0.0-preview.1
  - @serwist/cacheable-response@9.0.0-preview.1
  - @serwist/core@9.0.0-preview.1
  - @serwist/expiration@9.0.0-preview.1
  - @serwist/google-analytics@9.0.0-preview.1
  - @serwist/precaching@9.0.0-preview.1
  - @serwist/routing@9.0.0-preview.1

## 9.0.0-preview.0

### Major Changes

- [`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(validators): migrate to Zod

  - We now use Zod instead of AJV.
  - This allows us to further validate the values, as AJV didn't support validating functions, classes, and more.
  - Usually, you don't need to do anything. However, if you manipulate the log/error message to do something wicked, you may need to adapt to the new format:

  ```
  Received an invalid Serwist configuration: {
    "_errors": [
      "Received unrecognized keys: someInvalidKey"
    ],
    "additionalPrecacheEntries": {
      "_errors": [
        "Received invalid type: expected array, received string."
      ]
    }
  }
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

### Patch Changes

- Updated dependencies [[`30e4c25`](https://github.com/serwist/serwist/commit/30e4c25ac9fc319902c75682b16a5ba31bfbae58), [`defdd5a`](https://github.com/serwist/serwist/commit/defdd5a50f80e6c58e00dff8c608466c02fdc459)]:
  - @serwist/cacheable-response@9.0.0-preview.0
  - @serwist/routing@9.0.0-preview.0
  - @serwist/core@9.0.0-preview.0
  - @serwist/broadcast-update@9.0.0-preview.0
  - @serwist/google-analytics@9.0.0-preview.0
  - @serwist/background-sync@9.0.0-preview.0
  - @serwist/expiration@9.0.0-preview.0
  - @serwist/precaching@9.0.0-preview.0

## 8.4.4

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.4.4
  - @serwist/broadcast-update@8.4.4
  - @serwist/cacheable-response@8.4.4
  - @serwist/core@8.4.4
  - @serwist/expiration@8.4.4
  - @serwist/google-analytics@8.4.4
  - @serwist/precaching@8.4.4
  - @serwist/routing@8.4.4

## 8.4.3

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.4.3
  - @serwist/broadcast-update@8.4.3
  - @serwist/cacheable-response@8.4.3
  - @serwist/core@8.4.3
  - @serwist/expiration@8.4.3
  - @serwist/google-analytics@8.4.3
  - @serwist/precaching@8.4.3
  - @serwist/routing@8.4.3

## 8.4.2

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.4.2
  - @serwist/broadcast-update@8.4.2
  - @serwist/cacheable-response@8.4.2
  - @serwist/core@8.4.2
  - @serwist/expiration@8.4.2
  - @serwist/google-analytics@8.4.2
  - @serwist/precaching@8.4.2
  - @serwist/routing@8.4.2

## 8.4.1

### Patch Changes

- [#36](https://github.com/serwist/serwist/pull/36) [`d45c7a3`](https://github.com/serwist/serwist/commit/d45c7a3e62cd98eab3110038f3f90240bd5e6831) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(build): fixed CommonJS build crashing (again)

  - It is `stringify-object` this time.
  - A test has been added to help avoid this issue.

- Updated dependencies []:
  - @serwist/background-sync@8.4.1
  - @serwist/broadcast-update@8.4.1
  - @serwist/cacheable-response@8.4.1
  - @serwist/core@8.4.1
  - @serwist/expiration@8.4.1
  - @serwist/google-analytics@8.4.1
  - @serwist/precaching@8.4.1
  - @serwist/routing@8.4.1

## 8.4.0

### Patch Changes

- [#32](https://github.com/serwist/serwist/pull/32) [`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(docs): changed docs's URL

  - Currently we deploy at Cloudflare Pages.

- Updated dependencies [[`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d)]:
  - @serwist/cacheable-response@8.4.0
  - @serwist/broadcast-update@8.4.0
  - @serwist/google-analytics@8.4.0
  - @serwist/background-sync@8.4.0
  - @serwist/expiration@8.4.0
  - @serwist/precaching@8.4.0
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
  - @serwist/precaching@8.3.0
  - @serwist/routing@8.3.0

## 8.2.0

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.2.0
  - @serwist/broadcast-update@8.2.0
  - @serwist/cacheable-response@8.2.0
  - @serwist/core@8.2.0
  - @serwist/expiration@8.2.0
  - @serwist/google-analytics@8.2.0
  - @serwist/precaching@8.2.0
  - @serwist/routing@8.2.0

## 8.1.1

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.1.1
  - @serwist/broadcast-update@8.1.1
  - @serwist/cacheable-response@8.1.1
  - @serwist/core@8.1.1
  - @serwist/expiration@8.1.1
  - @serwist/google-analytics@8.1.1
  - @serwist/precaching@8.1.1
  - @serwist/routing@8.1.1

## 8.1.0

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.1.0
  - @serwist/broadcast-update@8.1.0
  - @serwist/cacheable-response@8.1.0
  - @serwist/core@8.1.0
  - @serwist/expiration@8.1.0
  - @serwist/google-analytics@8.1.0
  - @serwist/precaching@8.1.0
  - @serwist/routing@8.1.0

## 8.0.5

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.0.5
  - @serwist/broadcast-update@8.0.5
  - @serwist/cacheable-response@8.0.5
  - @serwist/core@8.0.5
  - @serwist/expiration@8.0.5
  - @serwist/google-analytics@8.0.5
  - @serwist/precaching@8.0.5
  - @serwist/routing@8.0.5

## 8.0.4

### Patch Changes

- [#10](https://github.com/serwist/serwist/pull/10) [`52edfe2`](https://github.com/serwist/serwist/commit/52edfe2f9e4ff2007747dd038023dbc94af52698) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(node-16-cjs): added type support for NodeNext with CommonJS

  - The "fix" is really simple - we copy `.d.ts` to `.old.d.cts` 💀
  - This also fixes the issue where using `@serwist/build`, `@serwist/webpack-plugin`, and their dependents with CommonJS crashes due to us using `pretty-bytes`, which is an ESM package.

- Updated dependencies [[`52edfe2`](https://github.com/serwist/serwist/commit/52edfe2f9e4ff2007747dd038023dbc94af52698)]:
  - @serwist/cacheable-response@8.0.4
  - @serwist/broadcast-update@8.0.4
  - @serwist/google-analytics@8.0.4
  - @serwist/background-sync@8.0.4
  - @serwist/expiration@8.0.4
  - @serwist/precaching@8.0.4
  - @serwist/routing@8.0.4
  - @serwist/core@8.0.4

## 8.0.3

### Patch Changes

- [`22bc8a8`](https://github.com/serwist/serwist/commit/22bc8a86e14873d8fc335c3ea4db11f46e91aa07) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(serwist/build): removed fsevents

  - Seems that it only supports Darwin, which means that other OSes' users are not be able to install the package (not sure why this doesn't happen to most people, including me). Not that we actually use it anyway.

- Updated dependencies []:
  - @serwist/background-sync@8.0.3
  - @serwist/broadcast-update@8.0.3
  - @serwist/cacheable-response@8.0.3
  - @serwist/core@8.0.3
  - @serwist/expiration@8.0.3
  - @serwist/google-analytics@8.0.3
  - @serwist/precaching@8.0.3
  - @serwist/routing@8.0.3

## 8.0.2

### Patch Changes

- Updated dependencies []:
  - @serwist/background-sync@8.0.2
  - @serwist/broadcast-update@8.0.2
  - @serwist/cacheable-response@8.0.2
  - @serwist/core@8.0.2
  - @serwist/expiration@8.0.2
  - @serwist/google-analytics@8.0.2
  - @serwist/precaching@8.0.2
  - @serwist/routing@8.0.2

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
  - @serwist/precaching@8.0.1
  - @serwist/routing@8.0.1

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
  - @serwist/broadcast-update@8.0.0
  - @serwist/google-analytics@8.0.0
  - @serwist/background-sync@8.0.0
  - @serwist/expiration@8.0.0
  - @serwist/precaching@8.0.0
  - @serwist/routing@8.0.0
  - @serwist/core@8.0.0
