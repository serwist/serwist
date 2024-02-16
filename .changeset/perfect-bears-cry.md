---
"@serwist/cacheable-response": minor
---

feat(cacheable-response): use `Headers` instead of a `headers` object

- Since `Headers.prototype.get()` is case-insensitive, I figured it would be nice to have our `headers` be the same. The easiest way to do that would be to also use `Headers`.
- Now, you can use a `HeadersInit` for `headers` rather than be limited to a map from `string` to `string` like before.
