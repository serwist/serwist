---
"@serwist/window": patch
---

fix(window): don't throw when `navigator.serviceWorker.register()` resolves without a registration

`Serwist.register()` read `.waiting` off the result of `navigator.serviceWorker.register()` without checking it first. That call is specified to resolve with a registration or reject, but not every environment honours it — under Playwright's `serviceWorkers: "block"` it resolves with `undefined`, and the read threw `TypeError: Cannot read properties of undefined (reading 'waiting')`. Since the common call sites fire registration without a rejection handler, that surfaced as an unhandled rejection at boot. `register()` now returns `undefined` in that case, which its return type already allowed.
