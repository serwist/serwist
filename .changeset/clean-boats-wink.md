---
"@serwist/webpack-plugin": patch
"@serwist/build": patch
"@serwist/turbopack": patch
"serwist": patch
"@serwist/next": patch
"@serwist/nuxt": patch
"@serwist/vite": patch
"@serwist/cli": patch
---

fix(utils): publish `@serwist/utils`

- This fixes `@serwist/utils` types being unresolvable when used in other packages.