---
"@serwist/strategies": patch
---

chore(strategies): only log Vary warning if `matchOptions?.ignoreVary` is not `true`

- Doesn't make sense to have this logged even when `matchOptions?.ignoreVary` is already `true`.