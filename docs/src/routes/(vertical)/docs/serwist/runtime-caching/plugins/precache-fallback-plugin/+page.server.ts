import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "PrecacheFallbackPlugin - Plugins - serwist",
  ogImage: encodeOpenGraphImage({
    title: "PrecacheFallbackPlugin",
    desc: "Plugins - serwist",
  }),
  toc: [
    {
      title: "PrecacheFallbackPlugin",
      id: "precache-fallback-plugin",
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
          title: "Usage",
          id: "usage",
        },
      ],
    },
  ],
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { PrecacheEntry } from "serwist";
declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;
// ---cut-before---
import { NetworkOnly, PrecacheFallbackPlugin, Serwist } from "serwist";

const serwist = new Serwist({
  // Assuming that your precache list includes "/fallback.html".
  precacheEntries: self.__SW_MANIFEST,
});

serwist.registerCapture(
  /^\\/admin\\/.*\\.html$/,
  new NetworkOnly({
    plugins: [
      new PrecacheFallbackPlugin({
        fallbackUrls: ["/fallback.html"],
        serwist,
      }),
    ],
  }),
);

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
