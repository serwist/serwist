---
"@serwist/precaching": minor
---

feat(precaching): support concurrent precaching

- `PrecacheController` now accepts a new option, "concurrentPrecaching", which should be a number of how many precache requests should be made concurrently.

- By default, we precache things sequentially, but this can be changed by setting this option.
