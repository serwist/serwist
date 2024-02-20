---
"@serwist/sw": patch
---

fix(sw.handlePrecaching): fixed code still being erroneously executed when `precacheEntries` is falsy

- We weren't supposed to handle `cleanupOutdatedCaches` and `navigateFallback` when the precache manifest is falsy. Really sorry for the inconvenience!
