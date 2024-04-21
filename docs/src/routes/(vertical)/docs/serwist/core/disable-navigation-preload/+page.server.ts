import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "disableNavigationPreload - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "disableNavigationPreload",
    desc: "The Serwist API - serwist",
  }),
  toc: [
    {
      title: "disableNavigationPreload",
      id: "disable-navigation-preload",
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
          code: `import {
  enableNavigationPreload,
  disableNavigationPreload,
  isNavigationPreloadSupported,
  NavigationRoute,
  NetworkFirst,
} from "serwist";
import { registerRoute } from "serwist/legacy";

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TOGGLE_NAV_PRELOAD") {
    event.waitUntil(
      (async () => {
        if (isNavigationPreloadSupported()) {
          const state = await self.registration.navigationPreload.getState();
          if (state.enabled) {
            disableNavigationPreload();
          } else {
            enableNavigationPreload();
          }
        }
      })(),
    );
  }
});

// Swap in NetworkOnly, CacheFirst, or StaleWhileRevalidate as needed.
const navigationStrategy = new NetworkFirst({
  cacheName: "cached-navigations",
});

const navigationRoute = new NavigationRoute(navigationStrategy, {
  // Optionally, provide a allow/denylist of RegExps to determine
  // which paths will match this route.
  // allowlist: [],
  // denylist: [],
});

registerRoute(navigationRoute);`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
