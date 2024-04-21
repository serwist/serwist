import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "PrecacheRoute - Routing - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "PrecacheRoute",
    desc: "Routing - Runtime caching - serwist",
  }),
  toc: [
    {
      title: "PrecacheRoute",
      id: "precache-route",
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
          title: "Usage",
          id: "usage",
        },
        {
          title: "More resources",
          id: "more-resources",
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
import { Serwist } from "serwist";

const serwist = new Serwist({
  // \`PrecacheRoute\` is automatically registered for you!
  precacheEntries: self.__SW_MANIFEST,
});

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
