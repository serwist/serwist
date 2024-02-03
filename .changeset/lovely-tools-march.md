---
"@serwist/next": major
---

chore(next): renamed /browser to /worker

- This new name makes more sense than the old one, for these exports are actually for use in service workers.
- To migrate, simply change all imports of `@serwist/next/browser` to those of `@serwist/next/worker`:

  - Old:

  ```ts
  import { defaultCache } from "@serwist/next/browser";

  installSerwist({
    // Other options
    runtimeCaching: defaultCache,
  });
  ```

  - New:

  ```ts
  import { defaultCache } from "@serwist/next/worker";

  installSerwist({
    // Other options
    runtimeCaching: defaultCache,
  });
  ```
