import { getHighlighter } from "shiki";

import { highlightCode } from "$lib/highlightCode";
import type { TocEntry } from "$lib/types";

export const load = async () => {
  const highligher = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["typescript", "javascript"],
  });
  return {
    title: "BroadcastCacheUpdate - @serwist/broadcast-update",
    toc: [
      {
        title: "BroadcastCacheUpdate",
        id: "broadcast-cache-update",
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
    ] satisfies TocEntry[],
    code: {
      usage: highlightCode(
        highligher,
        {
          "sw.ts": {
            code: `import { BroadcastCacheUpdate, defaultHeadersToCheck } from "@serwist/broadcast-update";

const broadcastUpdate = new BroadcastCacheUpdate({
  headersToCheck: [...defaultHeadersToCheck, "X-My-Custom-Header"],
});

const cacheName = "api-cache";
const request = new Request("https://example.com/api");

const cache = await caches.open(cacheName);
const oldResponse = await cache.match(request);
const newResponse = await fetch(request);

broadcastUpdate.notifyIfUpdated({
  cacheName,
  oldResponse,
  newResponse,
  request,
);`,
            lang: "javascript",
          },
          "message.ts": {
            code: `import { CACHE_UPDATED_MESSAGE_META } from "@serwist/broadcast-update";

navigator.serviceWorker.addEventListener("message", async (event) => {
  // Optional: ensure the message came from \`@serwist/broadcast-update\`
  if (event.data.meta === CACHE_UPDATED_MESSAGE_META) {
    const { cacheName, updatedURL } = event.data.payload;

    // Do something with cacheName and updatedURL.
    // For example, get the cached content and update
    // the content on the page.
    const cache = await caches.open(cacheName);
    const updatedResponse = await cache.match(updatedURL);
    const updatedText = await updatedResponse.text();
  }
});`,
            lang: "typescript",
          },
        },
        { idPrefix: "usage-example" },
      ),
    },
  };
};
