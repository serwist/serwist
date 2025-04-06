---
"@serwist/webpack-plugin": patch
"@serwist/next": patch
---

fix(webpack, next): fixed `relativeToOutputPath` erroneously returning non-Unix paths on Windows

- This caused `@serwist/next`'s `manifestTransform` to not work properly, resulting in a `manifestEntries` array with incorrect URLs.