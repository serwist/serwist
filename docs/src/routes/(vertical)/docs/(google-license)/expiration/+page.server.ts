import { highlightCode } from "$lib/highlightCode";
import type { TocEntry } from "$lib/types";
import { getHighlighter } from "shiki";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const highlighter = await getHighlighter({
    langs: ["typescript", "javascript"],
    themes: ["github-dark", "github-light"],
  });
  return {
    title: "@serwist/expiration",
    toc: [
      {
        title: "@serwist/expiration",
        id: "serwist-expiration",
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
    ] satisfies TocEntry[],
    code: {
      basicUsage: {
        maxEntries: highlightCode(
          highlighter,
          {
            "sw.ts": {
              code: `import { registerRoute } from "@serwist/routing";
import { CacheFirst } from "@serwist/strategies";
import { ExpirationPlugin } from "@serwist/expiration";

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
          highlighter,
          {
            "sw.ts": {
              code: `import { registerRoute } from "@serwist/routing";
import { CacheFirst } from "@serwist/strategies";
import { ExpirationPlugin } from "@serwist/expiration";

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
);
`,
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
          highlighter,
          {
            "sw.ts": {
              code: `import { CacheExpiration } from "@serwist/expiration";

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
          highlighter,
          {
            "sw.ts": {
              code: `await openCache.put(request, response);

await expirationManager.updateTimestamp(request.url);`,
              lang: "typescript",
            },
          },
          { idPrefix: "advanced-usage-update" },
        ),
        expire: highlightCode(
          highlighter,
          {
            "sw.ts": {
              code: "await expirationManager.expireEntries();",
              lang: "typescript",
            },
          },
          { idPrefix: "advanced-usage-expire" },
        ),
      },
    },
  };
};
