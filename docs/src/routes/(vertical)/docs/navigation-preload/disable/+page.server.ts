import { getHighlighter } from "shiki";

import { highlightCode } from "$lib/highlightCode";
import type { TocEntry } from "$lib/types";

export const load = async () => {
  const highligher = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["typescript", "javascript"],
  });
  return {
    title: "disable - @serwist/navigation-preload",
    toc: [
      {
        title: "disable",
        id: "disable",
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
    ] satisfies TocEntry[],
    code: {
      usage: highlightCode(
        highligher,
        {
          "sw.ts": {
            code: `import {
  enable as enableNavigationPreload,
  disable as disableNavigationPreload,
  isSupported as isNavigationPreloadSupported,
} from "@serwist/navigation-preload";
import { NetworkFirst } from "@serwist/strategies";
import { registerRoute, NavigationRoute } from "@serwist/routing";

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
  };
};
