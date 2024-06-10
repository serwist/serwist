---
"serwist": patch
---

fix(core): fixed `StrategyHandler`'s logging

- Thanks @jon-smith!

- Their PR message:

> Dev logging in `StrategyHandler` `_ensureResponseSafeToCache` would previously never get called as `responseToCache` was set to `undefined` before checking the status to log. Have rearranged the logic to fix this.
> 
> Also as I was following the docs to make this change I noticed the git clone command had some extra `--` so updated the docs to fix this.
> 
> Super minor things but thought I'd make a PR just in case it's useful!