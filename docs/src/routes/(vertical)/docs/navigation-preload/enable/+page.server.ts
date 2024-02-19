import { getHighlighter } from "shiki";

import { highlightCode } from "$lib/highlightCode";
import type { TocEntry } from "$lib/types";

export const load = async () => {
  const highligher = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["typescript", "javascript"],
  });
  return {
    title: "enable - @serwist/navigation-preload",
    toc: [
      {
        title: "enable",
        id: "enable",
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
    ] satisfies TocEntry[],
    code: {
      usage: highlightCode(
        highligher,
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
        { idPrefix: "usage-example" },
      ),
    },
  };
};
