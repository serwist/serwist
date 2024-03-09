import { highlightCode } from "$lib/highlightCode";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "@serwist/navigation-preload",
  ogImage: "@serwist/navigation-preload",
  toc: [
    {
      title: "@serwist/navigation-preload",
      id: "serwist-navigation-preload",
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
            code: `import { enable as enableNavigationPreload } from "@serwist/navigation-preload";
import { NetworkFirst } from "@serwist/strategies";
import { registerRoute, NavigationRoute } from "@serwist/routing";

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
