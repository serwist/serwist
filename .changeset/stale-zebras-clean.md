---
"@serwist/sw": patch
---

fix(sw): handle `RuntimeCaching.method` for `RuntimeCaching.handler` of type `"string"`

- There really should be something that prevents us from encountering issues like this again... I am imagining a test, but not sure how that should be done.
