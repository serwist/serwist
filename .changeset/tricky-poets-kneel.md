---
"@serwist/next": patch
---

fix(next): fixed `additionalPrecacheEntries` not having a default

- This is an age-old bug of `@ducanh2912/next-pwa` caused by an extra `?? []`, which results in the nullish check following the declaration to always be `false`.
