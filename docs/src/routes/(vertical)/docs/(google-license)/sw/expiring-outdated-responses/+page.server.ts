import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Expiring outdated responses",
  ogImage: encodeOpenGraphImage({
    title: "Expiring outdated responses",
    desc: "@serwist/sw/plugins",
  }),
  toc: [
    {
      title: "Expiring outdated responses",
      id: "expiring-outdated-responses",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Basic usage",
          id: "basic-usage",
          children: [
            {
              title: "Restrict the number of cache entries",
              id: "restrict-the-number-of-cache-entries",
            },
            {
              title: "Restrict the age of cached entries",
              id: "restrict-the-age-of-cached-entries",
            },
          ],
        },
        {
          title: "Advanced usage",
          id: "advanced-usage",
        },
      ],
    },
  ],
  code: {
    basicUsage: {
      maxEntries: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { ExpirationPlugin } from "@serwist/sw/plugins";
import { registerRoute } from "@serwist/sw/routing";
import { CacheFirst } from "@serwist/sw/strategies";

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
      }),
    ],
  }),
);`,
            lang: "typescript",
          },
        },
        { idPrefix: "basic-usage-max-entries" },
      ),
      maxAgeSeconds: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { ExpirationPlugin } from "@serwist/sw/plugins";
import { registerRoute } from "@serwist/sw/routing";
import { CacheFirst } from "@serwist/sw/strategies";

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  }),
);`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "basic-usage-max-age-seconds",
        },
      ),
    },
    advancedUsage: {
      setup: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { CacheExpiration } from "@serwist/sw/plugins";

const cacheName = "my-cache";
const expirationManager = new CacheExpiration(cacheName, {
  maxAgeSeconds: 24 * 60 * 60,
  maxEntries: 20,
});`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "advanced-usage-setup",
        },
      ),
      update: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `// @filename: sw.ts
import { CacheExpiration } from "@serwist/sw/plugins";

declare const request: Request;
declare const response: Response;

const cacheName = "my-cache";
const expirationManager = new CacheExpiration(cacheName, {
  maxAgeSeconds: 24 * 60 * 60,
  maxEntries: 20,
});
const openCache = await caches.open(cacheName);
// ---cut-before---
await openCache.put(request, response);

await expirationManager.updateTimestamp(request.url);`,
            lang: "typescript",
          },
        },
        { idPrefix: "advanced-usage-update" },
      ),
      expire: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `// @filename: sw.ts
import { CacheExpiration } from "@serwist/sw/plugins";

declare const request: Request;
declare const response: Response;

const cacheName = "my-cache";
const expirationManager = new CacheExpiration(cacheName, {
  maxAgeSeconds: 24 * 60 * 60,
  maxEntries: 20,
});
// ---cut-before---
await expirationManager.expireEntries();`,
            lang: "typescript",
          },
        },
        { idPrefix: "advanced-usage-expire" },
      ),
    },
  },
});
