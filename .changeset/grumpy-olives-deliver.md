---
"@serwist/cacheable-response": minor
"@serwist/broadcast-update": minor
"@serwist/google-analytics": minor
"@serwist/background-sync": minor
"@serwist/range-requests": minor
"@serwist/expiration": minor
"@serwist/precaching": minor
"@serwist/strategies": minor
"@serwist/routing": minor
"@serwist/sw": minor
---

refactor: merge service worker modules into `@serwist/sw`

- These service worker modules have been merged into `@serwist/sw`:
    - Modules now located at `@serwist/sw/plugins`:
        - `@serwist/background-sync`
        - `@serwist/broadcast-update`
        - `@serwist/cacheable-response`
        - `@serwist/expiration`
        - `@serwist/google-analytics`
        - `@serwist/range-requests`
    - Modules now located at `@serwist/sw/precaching`:
        - `@serwist/precaching`:
            - Excluding `PrecacheFallbackPlugin`, `PrecacheFallbackEntry`, and `PrecacheFallbackPluginOptions`, which are now at `@serwist/sw/plugins`.
    - Modules now located at `@serwist/sw/routing`:
        - `@serwist/routing`
    - Modules now located at `@serwist/sw/strategies`:
        - `@serwist/strategies`
- They remain operable for compatibility, but they will be marked as deprecated on npm.
