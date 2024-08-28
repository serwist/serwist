---
"@serwist/webpack-plugin": patch
"@serwist/build": patch
"@serwist/next": patch
"@serwist/nuxt": patch
"@serwist/cli": patch
---

chore(build): remove extraneous Node.js API wrappers

- Doesn't seem that we really need `fs-extra`, `pathe`, `fast-json-stable-stringify`, or `upath`, so let's just remove them.

- This also adds tests for Windows to ensure that we don't mess up.