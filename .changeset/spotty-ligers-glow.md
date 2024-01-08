---
"@serwist/vite": minor
---

refactor(vite): disintegrate `@serwist/vite` from `@serwist/build`

- What this means is that we don't use `@serwist/build.injectManifest` anymore. Using `define` just works™️
- The benefit of owning the entire codebase... :D
