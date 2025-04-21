---
"@serwist/build": major
---

feat(build/BREAKING_CHANGE): change default `globPatterns` to `["**/*.{js,css,html,ico,apng,png,avif,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,webp,json,webmanifest}"]`

- The new default adds various types of images and JSON and is exported from `@serwist/build` as `DEFAULT_GLOB_PATTERNS` to allow for extension.

- To use the old default, set `globPatterns` to `["**/*.{js,css,html"]`.

- For Webpack and Next.js users, no changes are needed due to `@serwist/webpack-plugin` and `@serwist/next` not leveraging `globPatterns`.