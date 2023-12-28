---
"@serwist/vite": minor
---

feat(vite): support development mode

- This is a bit different to how `vite-plugin-pwa` does it. In dev, the plugin handles the service worker in two ways:
  - If `devOptions.bundle` is enabled, hook a middleware that bundles the service worker through `api.generateSW()` and returns the result into Vite's dev server.
  - Otherwise, run `injectManifest` and return the service worker through `async load(id)`. Although `precacheEntries` is always `undefined`, we still do this to check the user's `injectManifest` options in dev mode.
