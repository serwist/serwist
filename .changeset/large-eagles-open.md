---
"@serwist/vite": minor
---

fix: generate the service worker for the app's client environment in multi-environment builds

- The service worker is now only built by the primary client environment, so extra environments do not generate it again.
- Options are resolved from the first resolved configuration, so `swDest`, `base` and the precache manifest URLs are no longer taken from whichever environment Vite resolved last (the SSR environment, for example), which could write `sw.js` into the server output directory.
- Vite 5 and older versions that do not support the Environment API keeps the legacy `build.ssr` check and still skips generation in an SSR build.
