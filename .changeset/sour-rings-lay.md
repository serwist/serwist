---
"@serwist/next": patch
---

fix(next): check if the current page is in the service worker's scope before registering

- Before, if `InjectPartial.scope` was set to some value, and you visited a page out of that scope, you would see the warning "The current page is not in scope for the registered service worker. Was this a mistake?" logged. This simply fixes that by checking if the page is in the scope before calling `window.serwist.register()`.

- Wondering if we should have removed /sw-entry.ts before the 9.0.0 release...
