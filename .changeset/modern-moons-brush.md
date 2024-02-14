---
"@serwist/google-analytics": major
---

chore(google-analytics): migrated to the singleton Router instance

- We now use `@serwist/routing.registerRoute`, rather than `@serwist/routing.Router` like in the past, for `initialize`.

- You don't need to do anything to migrate.