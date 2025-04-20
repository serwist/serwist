---
"@serwist/webpack-plugin": patch
"@serwist/react-router": patch
"@serwist/recipes": patch
"@serwist/streams": patch
"@serwist/svelte": patch
"@serwist/window": patch
"@serwist/build": patch
"@serwist/utils": patch
"serwist": patch
"@serwist/next": patch
"@serwist/nuxt": patch
"vite-plugin-serwist": patch
---

chore(all): mark all packages as side-effects-free

- All packages don't have side-effects, so `"sideEffects": false` has been added to them to aid bundlers in tree-shaking them.