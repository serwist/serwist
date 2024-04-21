import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "enableNavigationPreload - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "enableNavigationPreload",
    desc: "The Serwist API - serwist",
  }),
  toc: [
    {
      title: "enableNavigationPreload",
      id: "enable-navigation-preload",
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
      ],
    },
  ],
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { enableNavigationPreload, NavigationRoute, NetworkFirst } from "serwist";
import { registerRoute } from "serwist/legacy";

enableNavigationPreload();

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
