---
"@serwist/nuxt": patch
---

fix(nuxt): fixed `swDest` not working as expected when not set to an absolute path

- `swDest` should now be resolved relative to .output/public when it is not absolute path.

- Previously, setting a relative path would cause the service worker to not be included in the output, as it would be bundled to an unspecified location.