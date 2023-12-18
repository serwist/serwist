---
"@serwist/webpack-plugin": patch
---

fix(webpack-plugin): fixed default `swDest` resolving to `swSrc` with ".js" extension

- This behaviour is neither desired nor intended and as such has been fixed.

- It now resolves to `${output.path}/${swSrc.name}.js` by default, same as `workbox-webpack-plugin`.

- It is not my desire to cause a breaking change and not follow SemVer, but given that our current users are migrants from `@ducanh2912/next-pwa` and as such are unlikely to use `@serwist/webpack-plugin` rather than `@serwist/next`, this should not cause any harm.
