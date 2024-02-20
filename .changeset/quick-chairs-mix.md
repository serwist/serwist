---
"@serwist/webpack-plugin": minor
"@serwist/next": minor
---

refactor(webpack,next): allow webpack to be an optional `peerDependency`

- Since we support frameworks that ship a prebundled webpack, such as Next.js, it would be nice if we can take advantage of that as well.

- As a result, webpack is now an optional `peerDependency` for `@serwist/webpack-plugin` and is no longer a `peerDependency` for `@serwist/next`. Thanks to the fact that we currently don't use any webpack plugin, it is also not indirectly installed.
