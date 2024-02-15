---
"@serwist/cacheable-response": major
"@serwist/navigation-preload": major
"@serwist/broadcast-update": major
"@serwist/google-analytics": major
"@serwist/background-sync": major
"@serwist/range-requests": major
"@serwist/expiration": major
"@serwist/strategies": major
"@serwist/recipes": major
"@serwist/routing": major
"@serwist/streams": major
"@serwist/core": major
---

chore(core): allow non-Promise return types for `SerwistPlugin` callbacks

- Usually you don't need to do anything to migrate, but we still mark it as a breaking change because changing a function's signature is considered a breaking one in this project.
