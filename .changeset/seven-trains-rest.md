---
"@serwist/svelte": patch
"@serwist/next": patch
"@serwist/vite": patch
---

fix(svelte,next,vite): force `defaultCache` to only use NetworkOnly in development mode

- This is to prevent files from being accidentally cached during development mode, which isn't the behaviour you would expect to see anyway.

- URLs that are matched by these entries in production are now handled by NetworkOnly in development. No option to override this behaviour is provided, for it would provide little to no value. If you do need runtime caching to work during development, you have to copy `defaultCache` into your code.

- As a reminder for those who extend `defaultCache`, it should be placed below any custom entry, since such an entry wouldn't ever be matched otherwise.
