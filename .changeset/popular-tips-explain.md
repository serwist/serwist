---
"@serwist/precaching": minor
---

feat(precaching): support concurrent precaching

- `Serwist` now accepts a new option, `precacheOptions.concurrency`, which should be the number of precache requests that should be made concurrently.

- By default, we precache things 10 assets each, but this can be changed by setting this option.
