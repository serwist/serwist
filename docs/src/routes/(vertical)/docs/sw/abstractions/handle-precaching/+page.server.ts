import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "handlePrecaching - Abstracting away the APIs - @serwist/sw",
  ogImage: encodeOpenGraphImage({
    title: "handlePrecaching",
    desc: "Abstracting away the APIs - @serwist/sw",
  }),
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { SerwistGlobalConfig } from "@serwist/core";
import { clientsClaim } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";
import { handlePrecaching, registerRuntimeCaching } from "@serwist/sw";
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

self.skipWaiting();
clientsClaim();

handlePrecaching({ precacheEntries: self.__SW_MANIFEST });

registerRuntimeCaching(...defaultCache);`,
          lang: "typescript",
        },
        "sw.js": {
          code: `// @filename: sw-decl.d.ts
import type { SerwistGlobalConfig } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

// @filename: sw.js
// @types: ./sw-decl.d.ts
// @lib: esnext,webworker
const self = /** @type {ServiceWorkerGlobalScope} */(/** @type {unknown} */(globalThis.self));
// ---cut-before---
import { clientsClaim } from "@serwist/core";
import { handlePrecaching, registerRuntimeCaching } from "@serwist/sw";
import { defaultCache } from "@serwist/vite/worker";

self.skipWaiting();
clientsClaim();

handlePrecaching({ precacheEntries: self.__SW_MANIFEST });

registerRuntimeCaching(...defaultCache);`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
