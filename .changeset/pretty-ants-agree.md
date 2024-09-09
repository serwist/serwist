---
"serwist": patch
---

fix(core): catch navigation preload errors

- This change fixes cases where cache-first or precache strategies fail to return a cached response when the user is offline. This would happen due to `await event.preloadResponse` throwing an uncaught error.