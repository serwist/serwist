import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "CacheExpiration - Expiring outdated responses - @serwist/sw/plugins",
  ogImage: encodeOpenGraphImage({
    title: "CacheExpiration",
    desc: "Expiring outdated responses - @serwist/sw/plugins",
  }),
  toc: [
    {
      title: "CacheExpiration",
      id: "cache-expiration",
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
          code: `declare const request: Request;
declare const response: Response;
// ---cut-before---
import { CacheExpiration } from "@serwist/sw/plugins";

const cacheName = "my-cache";
const expirationManager = new CacheExpiration(cacheName, {
  maxAgeSeconds: 24 * 60 * 60,
  maxEntries: 20,
});
const openCache = await caches.open(cacheName);

// Put the response into the cache.
await openCache.put(request, response);

// Update the timestamp of the request.
await expirationManager.updateTimestamp(request.url);

// Expire entries that have reached max age.
await expirationManager.expireEntries();`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage" },
    ),
  },
});
