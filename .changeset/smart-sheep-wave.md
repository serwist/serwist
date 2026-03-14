---
"@serwist/turbopack": patch
---

feat(turbo): add option to rebuild sw.js on content change

- What? Adds a `rebuildOnChange` option to `@serwist/turbopack`. When enabled in development mode, the service worker automatically rebuilds whenever its source file content changes.

- Why? Currently, changes to the service worker in development require manual rebuilds or server restarts, which slows down development and can lead to stale behavior. This feature improves developer experience by keeping the service worker up-to-date automatically.

- How? Adds a SHA256 hash check on the service worker source file in development mode. If the content changes, the service worker is rebuilt before responding to GET requests. The feature is enabled by setting `rebuildOnChange: true` in the route configuration. Default value is `true`.
