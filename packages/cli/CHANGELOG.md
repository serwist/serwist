# @serwist/cli

## 9.2.2

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.2.2

## 9.2.1

### Patch Changes

- [#286](https://github.com/serwist/serwist/pull/286) [`3fb91a7`](https://github.com/serwist/serwist/commit/3fb91a793c914c4c14faae36de3108b307077f9b) Thanks [@afshinkoohsari](https://github.com/afshinkoohsari)! - fix(cli): convert Windows absolute paths to file URLs for ESM import

- Updated dependencies []:
  - @serwist/build@9.2.1

## 9.2.0

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.2.0

## 9.1.1

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.1.1

## 9.1.0

### Patch Changes

- [`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95), [`852df26`](https://github.com/serwist/serwist/commit/852df2609f700d28de6433e0cb6669ade13c5b95)]:
  - @serwist/build@9.1.0

## 9.0.15

### Patch Changes

- [`de27be5`](https://github.com/serwist/serwist/commit/de27be5c8c48afc6122e046dc116696cedfc93e4) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

  - Just the regular stuff. Serwist 10 is still on the way!

- Updated dependencies [[`de27be5`](https://github.com/serwist/serwist/commit/de27be5c8c48afc6122e046dc116696cedfc93e4)]:
  - @serwist/build@9.0.15

## 9.0.14

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.14

## 9.0.11

### Patch Changes

- [`cdefdc3`](https://github.com/serwist/serwist/commit/cdefdc32247f45a553a7a7ce4ff549fdf04290ce) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`cdefdc3`](https://github.com/serwist/serwist/commit/cdefdc32247f45a553a7a7ce4ff549fdf04290ce)]:
  - @serwist/build@9.0.11

## 9.0.10

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.10

## 9.0.9

### Patch Changes

- Updated dependencies [[`c19cc79`](https://github.com/serwist/serwist/commit/c19cc79bda805d1ca3d3bfa62f5c712fde54ab7f)]:
  - @serwist/build@9.0.9

## 9.0.8

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.8

## 9.0.7

### Patch Changes

- [#192](https://github.com/serwist/serwist/pull/192) [`ceea5d1`](https://github.com/serwist/serwist/commit/ceea5d1d56dfec9b3aafba41bd0b0f2916a4ac17) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(build): remove extraneous Node.js API wrappers

  - Doesn't seem that we really need `fs-extra`, `pathe`, `fast-json-stable-stringify`, or `upath`, so let's just remove them.
  - This also adds tests for Windows to ensure that we don't mess up.

- Updated dependencies [[`ceea5d1`](https://github.com/serwist/serwist/commit/ceea5d1d56dfec9b3aafba41bd0b0f2916a4ac17)]:
  - @serwist/build@9.0.7

## 9.0.6

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.6

## 9.0.5

### Patch Changes

- [#168](https://github.com/serwist/serwist/pull/168) [`c7bed2b`](https://github.com/serwist/serwist/commit/c7bed2b3a16be9b60cbb485500a3e893615f321d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(dependencies): reverted `glob` to v10 and `rimraf` to v5

  - Turns out `glob` v11 and `rimraf` v6 drops support for Node.js 18, so we are back to v10 and v5 for now.
  - This also adds test for Node.js 18 and 22.

- Updated dependencies [[`c7bed2b`](https://github.com/serwist/serwist/commit/c7bed2b3a16be9b60cbb485500a3e893615f321d)]:
  - @serwist/build@9.0.5

## 9.0.4

### Patch Changes

- [`db66e96`](https://github.com/serwist/serwist/commit/db66e96cb7fd8857200efc261d60cffaca1c0177) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): monthly dependencies maintenance

- Updated dependencies [[`db66e96`](https://github.com/serwist/serwist/commit/db66e96cb7fd8857200efc261d60cffaca1c0177)]:
  - @serwist/build@9.0.4

## 9.0.3

### Patch Changes

- [`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(deps): updated all dependencies

  - We have updated all dependencies to latest, as usual.

- Updated dependencies [[`c0d65aa`](https://github.com/serwist/serwist/commit/c0d65aa132fc93edd4fc52a7e2ee70df9a87b0ed)]:
  - @serwist/build@9.0.3

## 9.0.2

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.2

## 9.0.1

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.1

## 9.0.0

### Major Changes

- [#123](https://github.com/serwist/serwist/pull/123) [`2ad49d6`](https://github.com/serwist/serwist/commit/2ad49d61de4b634652b317c1146924492c7c59a1) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(cli): removed/renamed certain features

  - `copyLibraries` was already a no-op, so this simply removes the empty command.
  - `wizard --injectManifest` has become `wizard`, thanks to the fact that GenerateSW no longer exists.
  - Renamed the `injectManifest` command to `inject-manifest`. From now on, the CLI uses kebab-case rather than camelCase.

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

- Updated dependencies [[`add4fdd`](https://github.com/serwist/serwist/commit/add4fdd390555053d023faebfe1dca41510b2e2f), [`7b55ac5`](https://github.com/serwist/serwist/commit/7b55ac526a73826cb2d179a863d7eb29182616ee), [`4a5d51a`](https://github.com/serwist/serwist/commit/4a5d51ac8e9ed97b97754d8164990a08be65846d), [`7b55ac5`](https://github.com/serwist/serwist/commit/7b55ac526a73826cb2d179a863d7eb29182616ee)]:
  - @serwist/build@9.0.0

## 9.0.0-preview.26

### Patch Changes

- [`3a16582`](https://github.com/serwist/serwist/commit/3a165826cd07bb02f2cd2a8a7bedaf7c2bbeaed5) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: second stability test before stable release

- Updated dependencies [[`3a16582`](https://github.com/serwist/serwist/commit/3a165826cd07bb02f2cd2a8a7bedaf7c2bbeaed5)]:
  - @serwist/build@9.0.0-preview.26

## 9.0.0-preview.25

### Patch Changes

- [`7e00b79`](https://github.com/serwist/serwist/commit/7e00b79d3888fcdd0b2ac0c2cf5060b9cf91a9ea) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore: stability test before stable release

- Updated dependencies [[`7e00b79`](https://github.com/serwist/serwist/commit/7e00b79d3888fcdd0b2ac0c2cf5060b9cf91a9ea)]:
  - @serwist/build@9.0.0-preview.25

## 9.0.0-preview.24

### Patch Changes

- @serwist/build@9.0.0-preview.24

## 9.0.0-preview.23

### Patch Changes

- @serwist/build@9.0.0-preview.23

## 9.0.0-preview.22

### Patch Changes

- @serwist/build@9.0.0-preview.22

## 9.0.0-preview.21

### Patch Changes

- @serwist/build@9.0.0-preview.21

## 9.0.0-preview.20

### Patch Changes

- @serwist/build@9.0.0-preview.20

## 9.0.0-preview.19

### Patch Changes

- 6d294f9: refactor: migrate to GitLab

  - Serwist and `@ducanh2912/next-pwa` have migrated to GitLab.
  - This was the result of GitHub flagging my account, organizations, and repositories as spam. Sorry for the inconvenience.

- Updated dependencies [6d294f9]
  - @serwist/build@9.0.0-preview.19

## 9.0.0-preview.18

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.18

## 9.0.0-preview.17

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.17

## 9.0.0-preview.16

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.16

## 9.0.0-preview.15

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.15

## 9.0.0-preview.14

### Major Changes

- [`2ad49d6`](https://github.com/serwist/serwist/commit/2ad49d61de4b634652b317c1146924492c7c59a1) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor(cli): removed/renamed certain features

  - `copyLibraries` was already a no-op, so this simply removes the empty command.
  - `wizard --injectManifest` has become `wizard`, thanks to the fact that GenerateSW no longer exists.
  - Renamed the `injectManifest` command to `inject-manifest`. From now on, the CLI uses kebab-case rather than camelCase.

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.14

## 9.0.0-preview.13

### Patch Changes

- Updated dependencies [[`add4fdd`](https://github.com/serwist/serwist/commit/add4fdd390555053d023faebfe1dca41510b2e2f)]:
  - @serwist/build@9.0.0-preview.13

## 9.0.0-preview.12

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.12

## 9.0.0-preview.11

### Major Changes

- [`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - refactor: use iterables

  - Serwist now uses iterables in its code. For instance, `Headers.prototype.entries()` can be noticed at parts of `@serwist/cacheable-response`.
  - This is partly thanks to our Node.js requirement being bumped to 18.0.0. Iterables have been supported in all major browsers for ages, so they wouldn't be a problem (hell, all browsers that support service workers have support for iterables).
  - Still, since this requires us to enforce the use of Node.js 18.0.0 or later, it is marked a breaking change.

### Patch Changes

- Updated dependencies [[`ea0944c`](https://github.com/serwist/serwist/commit/ea0944c5b7b9d39cecda423e1e60b7bd11723063)]:
  - @serwist/build@9.0.0-preview.11

## 9.0.0-preview.10

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.10

## 9.0.0-preview.9

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.9

## 9.0.0-preview.8

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.8

## 9.0.0-preview.7

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.7

## 9.0.0-preview.6

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.6

## 9.0.0-preview.5

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.5

## 9.0.0-preview.4

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.4

## 9.0.0-preview.3

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.3

## 9.0.0-preview.2

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.2

## 9.0.0-preview.1

### Patch Changes

- Updated dependencies []:
  - @serwist/build@9.0.0-preview.1

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

## 8.4.4

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.4.4

## 8.4.3

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.4.3

## 8.4.2

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.4.2

## 8.4.1

### Patch Changes

- Updated dependencies [[`d45c7a3`](https://github.com/serwist/serwist/commit/d45c7a3e62cd98eab3110038f3f90240bd5e6831)]:
  - @serwist/build@8.4.1

## 8.4.0

### Patch Changes

- [#32](https://github.com/serwist/serwist/pull/32) [`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - chore(docs): changed docs's URL

  - Currently we deploy at Cloudflare Pages.

- Updated dependencies [[`87fea3c`](https://github.com/serwist/serwist/commit/87fea3c8ce51eab78404e64887b3840b9f633d9d)]:
  - @serwist/build@8.4.0

## 8.3.0

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.3.0

## 8.2.0

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.2.0

## 8.1.1

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.1.1

## 8.1.0

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.1.0

## 8.0.5

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.0.5

## 8.0.4

### Patch Changes

- Updated dependencies [[`52edfe2`](https://github.com/serwist/serwist/commit/52edfe2f9e4ff2007747dd038023dbc94af52698)]:
  - @serwist/build@8.0.4

## 8.0.3

### Patch Changes

- Updated dependencies [[`22bc8a8`](https://github.com/serwist/serwist/commit/22bc8a86e14873d8fc335c3ea4db11f46e91aa07)]:
  - @serwist/build@8.0.3

## 8.0.2

### Patch Changes

- Updated dependencies []:
  - @serwist/build@8.0.2

## 8.0.1

### Patch Changes

- [`15fb388`](https://github.com/serwist/serwist/commit/15fb38839a5b3b06bdaa39994fba29b56d05b301) Thanks [@DuCanhGH](https://github.com/DuCanhGH)! - fix(publish): removed declarations map

- Updated dependencies [[`15fb388`](https://github.com/serwist/serwist/commit/15fb38839a5b3b06bdaa39994fba29b56d05b301)]:
  - @serwist/build@8.0.1

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
  - @serwist/build@8.0.0
