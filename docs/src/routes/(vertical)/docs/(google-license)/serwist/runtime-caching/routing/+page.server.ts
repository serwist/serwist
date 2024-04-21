import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Routing - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Routing",
    desc: "Runtime caching - serwist",
  }),
  toc: [
    {
      title: "Routing",
      id: "routing",
      children: [
        {
          title: "Applying caching strategies with route matching",
          id: "route-matching",
        },
        {
          title: "Matching all navigation requests",
          id: "registering-navigation-route",
        },
        {
          title: "Setting a default handler",
          id: "setting-default-handler",
        },
        {
          title: "Setting a catch handler",
          id: "setting-catch-handler",
        },
        {
          title: "Defining a route for non-GET requests",
          id: "route-matching-non-get",
        },
      ],
    },
  ],
  code: {
    imageExample: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { CacheFirst, Serwist } from "serwist";

const serwist = new Serwist();

serwist.registerCapture(({ request, sameOrigin }) => {
  return sameOrigin && request.destination === "image";
}, new CacheFirst());

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "example-image" },
    ),
    navigationRoute: highlightCode(
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
      { idPrefix: "route-matching-navigation-route" },
    ),
    navigateFallback: highlightCode(
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
import { NavigationRoute, Serwist } from "serwist";

const serwist = new Serwist({
  // Assuming that your precache list includes "/app-shell.html".
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    navigateFallback: "/app-shell.html",
  },
});

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "route-matching-navigate-fallback" },
    ),
    defaultHandler: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { Serwist } from "serwist";
declare const serwist: Serwist;
// ---cut-before---
import { CacheFirst } from "serwist";

const cacheFirst = new CacheFirst();

// Example: If HTTP method is \`GET\`, use the \`CacheFirst\` strategy,
// go to the network otherwise.
serwist.setDefaultHandler(({ event, request, url, params }) => {
  if (request.method === "GET") {
    return cacheFirst.handle({ event, request, url, params });
  }
  return fetch(request);
});

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "route-matching-default-handler" },
    ),
    catchHandler: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { Serwist } from "serwist";
declare const serwist: Serwist;
// ---cut-before---
// Example: Setting up offline fallbacks.
serwist.setCatchHandler(async ({ request }) => {
  const dest = request.destination;

  if (dest === "document") {
    const match = await serwist.matchPrecache("/offline.html");
    return match || Response.error();
  }

  if (dest === "image") {
    const match = await serwist.matchPrecache("/fallback.png");
    return match || Response.error();
  }

  if (dest === "font") {
    const match = await serwist.matchPrecache("/fonts/fallback.woff2");
    return match || Response.error();
  }

  return Response.error();
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "route-matching-catch-handler" },
    ),
    nonGet: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import type { Serwist } from "serwist";
declare const serwist: Serwist;
// ---cut-before---
import { NetworkFirst } from "serwist";

serwist.registerCapture(/^\\/api\\/.*/, new NetworkFirst(), "POST");

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "route-matching-non-get" },
    ),
  },
});
