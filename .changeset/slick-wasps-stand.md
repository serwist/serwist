---
"@serwist/window": patch
---

chore(window/preview): add clear no side-effects indicator

- React Router couldn't tree shake `@serwist/window` from its SSR build as it regarded the package as having side effects.