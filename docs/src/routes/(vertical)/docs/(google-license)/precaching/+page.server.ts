import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "@serwist/precaching",
  ogImage: encodeOpenGraphImage("@serwist/precaching"),
  toc: [
    {
      title: "@serwist/precaching",
      id: "serwist-precaching",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "How @serwist/precaching works",
          id: "how-serwist-precaching-works",
          children: [
            {
              title: "Serving precached responses",
              id: "serving-precached-responses",
            },
          ],
        },
        {
          title: "Explanation of the precache list",
          id: "explanation-of-the-precache-list",
        },
        {
          title: "Basic usage",
          id: "basic-usage",
        },
      ],
    },
  ],
  code: {
    explainPrecacheList: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { precacheAndRoute } from "@serwist/precaching";

precacheAndRoute([
  { url: "/index.html", revision: "383676" },
  { url: "/styles/app.0c9a31.css", revision: null },
  { url: "/scripts/app.0d5770.js", revision: null },
  // Other entries...
]);`,
          lang: "typescript",
        },
      },
      { idPrefix: "explanation-of-the-precache-list" },
    ),
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
