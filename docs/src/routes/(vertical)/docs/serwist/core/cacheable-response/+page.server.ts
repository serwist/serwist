import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "CacheableResponse - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "CacheableResponse",
    desc: "The Serwist API - serwist",
  }),
  toc: [
    {
      title: "CacheableResponse",
      id: "cacheable-response",
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
          title: "Options",
          id: "options",
        },
        {
          title: "Methods and fields",
          id: "methods-and-fields",
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
          code: `import { CacheableResponse } from "serwist";

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
      { idPrefix: "usage" },
    ),
  },
});
