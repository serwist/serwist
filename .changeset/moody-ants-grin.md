---
"@serwist/background-sync": patch
"@serwist/broadcast-update": patch
"@serwist/build": patch
"@serwist/cacheable-response": patch
"@serwist/cli": patch
"@serwist/core": patch
"@serwist/expiration": patch
"@serwist/google-analytics": patch
"@serwist/navigation-preload": patch
"@serwist/next": patch
"@serwist/nuxt": patch
"@serwist/precaching": patch
"@serwist/range-requests": patch
"@serwist/recipes": patch
"@serwist/routing": patch
"@serwist/strategies": patch
"@serwist/streams": patch
"@serwist/svelte": patch
"@serwist/sw": patch
"@serwist/turbopack": patch
"@serwist/utils": patch
"@serwist/vite": patch
"@serwist/webpack-plugin": patch
"@serwist/window": patch
"serwist": patch
---

chore(deps): bump dependencies & migrated to SvelteKit 3

- Monthly dependency maintenance.

- Migrated to SvelteKit 3, dropping unsupported exports such as `basePath`, `immutableAssets`, `staticAssets`, `prerenderedRoutes`, `serviceWorkerVersion`, and `getPrecacheManifest`. Given low adoption of `@serwist/svelte`, this will not be regarded as a breaking change.