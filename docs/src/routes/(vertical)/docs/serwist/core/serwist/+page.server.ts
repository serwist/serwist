import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Serwist - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Serwist",
    desc: "The Serwist API - serwist",
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
          title: "Options",
          id: "options",
        },
        {
          title: "Behind the constructor",
          id: "behind-the-constructor",
        },
        {
          title: "Methods and fields",
          id: "methods-and-fields",
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
          code: `import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
// This import depends on your framework. For example, if you use Next.js, it should
// be @serwist/next/worker rather than @serwist/vite/worker.
import { defaultCache } from "@serwist/vite/worker";

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
  disableDevLogs: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "basic-usage" },
    ),
  },
});
