---
"vite-plugin-serwist": minor
---

feat(vite-plugin-serwist): renamed package, deprecated API, removed types

- Renamed `@serwist/vite` to `vite-plugin-serwist` to follow the Vite Plugin naming conventions. The old package will be deprecated.

- Deprecated `createApi` and `SerwistViteApi`. Instead of `api.generateSW()`, use `generateServiceWorker(ctx)`.

- Removed `ExtendManifestEntriesHook`.

- Fixed the issue where `envPrefix`, `envDir`, and other options are not respected.

- This update prepares for the introduction of `@serwist/remix`, `@serwist/astro`, etc. We may also update `@serwist/svelte` later.