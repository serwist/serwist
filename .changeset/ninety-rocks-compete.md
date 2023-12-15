---
"@serwist/cacheable-response": patch
"@serwist/navigation-preload": patch
"@serwist/broadcast-update": patch
"@serwist/google-analytics": patch
"@serwist/background-sync": patch
"@serwist/range-requests": patch
"@serwist/webpack-plugin": patch
"@serwist/expiration": patch
"@serwist/precaching": patch
"@serwist/strategies": patch
"@serwist/constants": patch
"@serwist/recipes": patch
"@serwist/routing": patch
"@serwist/streams": patch
"@serwist/window": patch
"@serwist/build": patch
"@serwist/core": patch
"@serwist/next": patch
"@serwist/sw": patch
---

fix(node-16-cjs): added type support for NodeNext with CommonJS

- The "fix" is really simple - we copy `.d.ts` to `.old.d.cts` 💀
- This also fixes the issue where using `@serwist/build`, `@serwist/webpack-plugin`, and their dependents with CommonJS crashes due to us using `pretty-bytes`, which is an ESM package.
