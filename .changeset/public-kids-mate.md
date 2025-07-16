---
"@serwist/webpack-plugin": minor
"@serwist/build": minor
"@serwist/next": minor
"@serwist/nuxt": minor
"@serwist/vite": minor
---

feat(build): migrate to Zod 4

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