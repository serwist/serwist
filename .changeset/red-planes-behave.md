---
"@serwist/sw": major
---

fix(sw): disable `runtimeCaching`, `fallbacks`, and `registerRuntimeCaching` in development mode

- In development mode, these features are now forcibly disabled. This is to prevent files from being accidentally served outdated.
- If you want to override this, simply add the following:

```ts
import { installSerwist } from "@serwist/sw";

declare global {
  interface WorkerGlobalScope {
    __WB_FORCE_RUNTIME_CACHING: boolean;
  }
}

self.__WB_FORCE_RUNTIME_CACHING = true;

installSerwist({
  runtimeCaching: [
    // ...
  ],
});
```
