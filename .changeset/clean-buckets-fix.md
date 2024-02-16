---
"@serwist/cacheable-response": major
"@serwist/navigation-preload": major
"@serwist/broadcast-update": major
"@serwist/google-analytics": major
"@serwist/background-sync": major
"@serwist/range-requests": major
"@serwist/webpack-plugin": major
"@serwist/expiration": major
"@serwist/precaching": major
"@serwist/strategies": major
"@serwist/constants": major
"@serwist/recipes": major
"@serwist/routing": major
"@serwist/streams": major
"@serwist/svelte": major
"@serwist/window": major
"@serwist/build": major
"@serwist/utils": major
"@serwist/core": major
"@serwist/next": major
"@serwist/nuxt": major
"@serwist/vite": major
"@serwist/cli": major
"@serwist/sw": major
---

refactor: use iterables

- Serwist now uses iterables in its code. For instance, `Headers.prototype.entries()` can be noticed at parts of `@serwist/cacheable-response`.
- This is partly thanks to our Node.js requirement being bumped to 18.0.0. Iterables have been supported in all major browsers for ages, so they wouldn't be a problem (hell, all browsers that support service workers have support for iterables).
- Still, since this requires us to enforce the use of Node.js 18.0.0 or later, it is marked a breaking change.
