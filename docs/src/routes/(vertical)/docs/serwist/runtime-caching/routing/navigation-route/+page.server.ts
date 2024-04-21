import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "NavigationRoute - Routing - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "NavigationRoute",
    desc: "Routing - Runtime caching - serwist",
  }),
  toc: [
    {
      title: "NavigationRoute",
      id: "navigation-route",
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
// Example: handling all navigations using an app shell.
import { NavigationRoute, Serwist } from "serwist";

const serwist = new Serwist({
  // Assuming that your precache list includes "/app-shell.html".
  precacheEntries: self.__SW_MANIFEST,
});

// This assumes that "/app-shell.html" has been precached.
serwist.registerRoute(new NavigationRoute(serwist.createHandlerBoundToUrl("/app-shell.html")));

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
