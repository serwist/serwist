---
"@serwist/webpack-plugin": major
---

chore(webpack-plugin): removed `mode`

- This option was already a no-op before that, so this simply removes it from the types.
- To migrate, just remove `mode` from your options.