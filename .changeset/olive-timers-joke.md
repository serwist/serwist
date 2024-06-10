---
"@serwist/svelte": patch
"@serwist/next": patch
"@serwist/nuxt": patch
"@serwist/vite": patch
---

fix(frameworks): use `NetworkOnly` for `defaultCache` in dev

- If we set `runtimeCaching` to an empty array, all preload responses are discarded, causing certain browsers to log a certain error message. This change fixes that error for developers using `defaultCache` in development mode.