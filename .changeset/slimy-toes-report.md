---
"@serwist/next": minor
---

feat(next): added `@serwist/next/worker.definePageRuntimeCaching`

- Due to the fact that App Router pages use RSC, we define 3 `runtimeCaching` entries in `defaultCache`, which are `"pages-rsc-prefetch"`, `"pages-rsc"`, and `"pages"`. However, if an user were to extend this `runtimeCaching` array with their own pages entries, they would have to copy this from `defaultCache`, requiring them to inspect the source code. This method was added so that the user can conveniently do the same without the hassle.
