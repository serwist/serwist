---
"@serwist/expiration": minor
---

feat(expiration.ExpirationPlugin): added `maxAgeFrom`

- This allows you to decide whether `maxAgeSeconds` should be calculated from when an entry was last fetched or when it was last used.

- For more information, [see the original Workbox issue](https://github.com/GoogleChrome/workbox/issues/2863).
