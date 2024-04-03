import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Setting cacheability criteria",
  ogImage: encodeOpenGraphImage({
    title: "Setting cacheability criteria",
    desc: "@serwist/sw/plugins",
  }),
  toc: [
    {
      title: "Setting cacheability criteria",
      id: "setting-cacheability-criteria",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "The defaults",
          id: "the-defaults",
          children: [
            {
              title: "Why are there different defaults?",
              id: "why-are-there-different-defaults",
            },
          ],
        },
        {
          title: "Basic usage",
          id: "basic-usage",
        },
        {
          title: "Advanced usage",
          id: "advanced-usage",
        },
      ],
    },
  ],
  code: {
    basicUsage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { CacheableResponsePlugin } from "@serwist/sw/plugins";
import { registerRoute } from "@serwist/sw/routing";
import { StaleWhileRevalidate } from "@serwist/sw/strategies";

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
        headers: {
          "X-Is-Cacheable": "true",
        },
      }),
    ],
  }),
);`,
          lang: "typescript",
        },
      },
      { idPrefix: "basic-usage" },
    ),
    advancedUsage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { CacheableResponse } from "@serwist/sw/plugins";

const cacheable = new CacheableResponse({
  statuses: [0, 200],
  headers: {
    "X-Is-Cacheable": "true",
  },
});

const response = await fetch("/path/to/api");

if (cacheable.isResponseCacheable(response)) {
  const cache = await caches.open("api-cache");
  cache.put(response.url, response);
} else {
  // Do something when the response can't be cached.
}`,
          lang: "typescript",
        },
      },
      {
        idPrefix: "advanced-usage",
      },
    ),
  },
});
