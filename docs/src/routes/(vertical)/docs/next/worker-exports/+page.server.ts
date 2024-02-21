import { highlightCode } from "$lib/highlightCode";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Worker exports - @serwist/next",
  code: {
    defaultCache: {
      usage: highlightCode(
        locals.highlighter,
        {
          "app/sw.ts": {
            code: `import type { SerwistGlobalConfig } from "@serwist/core";
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your \`injectionPoint\`.
    // \`injectionPoint\` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});`,
            lang: "typescript",
          },
          "app/sw.js": {
            code: `import type { SerwistGlobalConfig } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
import { defaultCache } from "@serwist/next/worker";
import { installSerwist } from "@serwist/sw";

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "default-cache-usage-example" },
      ),
    },
  },
});
