---
"@serwist/next": patch
---

fix(next): fixed invalid precache manifest being generated when `basePath` is set

- This is caused by "/\_next/../public" in `modifyURLPrefix` not being matched when `basePath` is set, since the URL is actually "${basePath}/\_next/../public/\*\*/\*".
- We now use `manifestTransforms` instead of `modifyURLPrefix`.