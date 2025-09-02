---
"@serwist/nuxt": patch
---

fix(nuxt): fixed `globPatterns` not using default glob patterns when `undefined`

- When `globPatterns` is `undefined`, `@serwist/nuxt` should now set it to Serwist's default glob patterns.

- This bug was previously caused by `@serwist/nuxt` having its own `globPatterns`, leading to the default glob patterns not being added via `@serwist/build`'s Zod schema.