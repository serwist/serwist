---
"@serwist/next": major
---

chore(next): renamed "/browser" to "/worker"

- This new name makes more sense than the old one, for these exports are actually for use in service workers.
- To migrate, simply change all imports of `@serwist/next/browser` to those of `@serwist/next/worker`:

  - Old:

  ```ts
  import { installSerwist } from "@serwist/sw";
  import { defaultCache } from "@serwist/next/browser";

  installSerwist({
    // Other options
    runtimeCaching: defaultCache,
  });
  ```

  - New:

  ```ts
  import { Serwist } from "serwist";
  import { defaultCache } from "@serwist/next/worker";

  const serwist = new Serwist({
    // Other options
    runtimeCaching: defaultCache,
  });

  serwist.addEventListeners();
  ```
