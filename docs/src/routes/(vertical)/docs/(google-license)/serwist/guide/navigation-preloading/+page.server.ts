import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Preloading navigations",
  ogImage: encodeOpenGraphImage({
    title: "Preloading navigations",
    desc: "serwist",
  }),
  toc: [
    {
      title: "Preloading navigations",
      id: "navigation-preloading",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Who should enable navigation preloading?",
          id: "who-should-enable-navigation-preloading",
        },
        {
          title: "Basic usage",
          id: "basic-usage",
        },
      ],
    },
  ],
  code: {
    basicUsage: {
      setup: highlightCode(
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
        { idPrefix: "basic-usage" },
      ),
    },
  },
});
