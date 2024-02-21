import { highlightCode } from "$lib/highlightCode";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "disableDevLogs - @serwist/sw",
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { SerwistGlobalConfig } from "@serwist/core";
import { clientsClaim } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";
import { disableDevLogs, handlePrecaching, registerRuntimeCaching } from "@serwist/sw";
import { defaultCache } from "@serwist/vite/worker";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your \`injectionPoint\`.
    // \`injectionPoint\` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

disableDevLogs();

self.skipWaiting();
clientsClaim();

handlePrecaching({ precacheEntries: self.__SW_MANIFEST });

registerRuntimeCaching(...defaultCache);`,
          lang: "typescript",
        },
        "sw.js": {
          code: `// @filename: sw.ts
import type { SerwistGlobalConfig } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
import { clientsClaim } from "@serwist/core";
import { disableDevLogs, handlePrecaching, registerRuntimeCaching } from "@serwist/sw";
import { defaultCache } from "@serwist/vite/worker";

disableDevLogs();

self.skipWaiting();
clientsClaim();

handlePrecaching({ precacheEntries: self.__SW_MANIFEST });

registerRuntimeCaching(...defaultCache);`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
