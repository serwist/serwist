---
"@serwist/cacheable-response": major
"@serwist/navigation-preload": major
"@serwist/broadcast-update": major
"@serwist/google-analytics": major
"@serwist/background-sync": major
"@serwist/range-requests": major
"@serwist/webpack-plugin": major
"@serwist/expiration": major
"@serwist/precaching": major
"@serwist/strategies": major
"@serwist/constants": major
"@serwist/recipes": major
"@serwist/routing": major
"@serwist/streams": major
"@serwist/window": major
"@serwist/build": major
"@serwist/core": major
"@serwist/next": major
"@serwist/cli": major
"@serwist/sw": major
---

chore: initial release

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
