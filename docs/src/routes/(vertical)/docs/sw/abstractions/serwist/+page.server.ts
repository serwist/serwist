import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Serwist - Abstracting away the APIs - @serwist/sw",
  ogImage: encodeOpenGraphImage({
    title: "Serwist",
    desc: "Abstracting away the APIs - @serwist/sw",
  }),
  toc: [
    {
      title: "Serwist",
      id: "serwist",
      children: [
        {
          title: "First added",
          id: "first-added",
        },
        {
          title: "About",
          id: "about",
        },
        {
          title: "Parameters",
          id: "parameters",
        },
        {
          title: "Methods and fields",
          id: "methods-and-fields",
        },
        {
          title: "Behind the install function",
          id: "behind-the-install-function",
        },
        {
          title: "Usage",
          id: "usage",
        },
      ],
    },
  ],
  code: {
    basicUsage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { SerwistGlobalConfig } from "@serwist/core";
import type { PrecacheEntry } from "@serwist/precaching";
import { Serwist } from "@serwist/sw";
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

const serwist = new Serwist();

serwist.install({
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
import { Serwist } from "@serwist/sw";
// This import depends on your framework. For example, if you use Next.js, it should
// be @serwist/next/worker rather than @serwist/vite/worker.
import { defaultCache } from "@serwist/vite/worker";

const serwist = new Serwist();

serwist.install({
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
