import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Worker exports - @serwist/next",
  ogImage: encodeOpenGraphImage({
    title: "Worker exports",
    desc: "@serwist/next",
  }),
  toc: [
    {
      title: "Worker exports",
      id: "worker-exports",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Exported values",
          id: "exported-values",
          children: [
            {
              title: "defaultCache",
              id: "default-cache",
            },
          ],
        },
      ],
    },
  ],
  code: {
    defaultCache: {
      usage: highlightCode(
        locals.highlighter,
        {
          "app/sw.ts": {
            code: `import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your \`injectionPoint\`.
    // \`injectionPoint\` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();`,
            lang: "typescript",
          },
          "app/sw.js": {
            code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();`,
            lang: "typescript",
          },
        },
        { idPrefix: "default-cache-usage-example" },
      ),
    },
  },
});
