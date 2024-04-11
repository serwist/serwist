---
"serwist": major
---

refactor(sw): moved `@serwist/build.RuntimeCaching` to `serwist`

- Since `runtimeCaching` is now a part of `serwist` rather than `@serwist/build`, it makes more sense to move the types there as well.
- To migrate, simply update the imports.
  - Old:
  ```ts
  import type { StrategyName, RuntimeCaching } from "@serwist/build";
  ```
  - New:
  ```ts
  import type { StrategyName, RuntimeCaching } from "serwist";
  ```
