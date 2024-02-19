import { highlightCode } from "$lib/highlightCode";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "installSerwist - @serwist/sw",
  code: {
    basicUsage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { SerwistGlobalConfig } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";
// This import depends on your framework. For example, if you use Next.js, it should
// be @serwist/next/worker rather than @serwist/vite/worker.
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

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: defaultCache,
});`,
          lang: "typescript",
        },
        "sw.js": {
          code: `import { installSerwist } from "@serwist/sw";
// This import depends on your framework. For example, if you use Next.js, it should
// be @serwist/next/worker rather than @serwist/vite/worker.
import { defaultCache } from "@serwist/vite/worker";

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: defaultCache,
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "basic-usage" },
    ),
  },
});
