import { getHighlighter } from "shiki";

import { highlightCode } from "$lib/highlightCode";
import type { TableOfContents } from "$lib/types";

export const load = async () => {
  const highlighter = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["typescript", "javascript"],
  });
  return {
    title: "Constants - @serwist/broadcast-update",
    toc: [
      {
        title: "Constants",
        id: "constants",
        children: [
          {
            title: "Exported values",
            id: "exported-values",
            children: [
              {
                title: "CACHE_UPDATED_MESSAGE_META",
                id: "cache-updated-message-meta",
              },
              {
                title: "CACHE_UPDATED_MESSAGE_TYPE",
                id: "cache-updated-message-type",
              },
              {
                title: "defaultHeadersToCheck",
                id: "default-headers-to-check",
              },
            ],
          },
        ],
      },
    ] satisfies TableOfContents[],
    code: {
      cacheUpdatedMessageMeta: {
        usage: highlightCode(
          highlighter,
          {
            "sw.ts": {
              code: `import { CACHE_UPDATED_MESSAGE_META } from "@serwist/broadcast-update";

navigator.serviceWorker.addEventListener("message", async (event) => {
  // Ensure the message came from \`@serwist/broadcast-update\`
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
          { idPrefix: "cache-updated-message-meta-usage" },
        ),
      },
      cacheUpdatedMessageType: {
        usage: highlightCode(
          highlighter,
          {
            "sw.ts": {
              code: `import { CACHE_UPDATED_MESSAGE_TYPE } from "@serwist/broadcast-update";

navigator.serviceWorker.addEventListener("message", async (event) => {
  // Ensure the message came from \`@serwist/broadcast-update\`
  if (event.data.type === CACHE_UPDATED_MESSAGE_TYPE) {
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
          { idPrefix: "cache-updated-message-type-usage" },
        ),
      },
      defaultHeadersToCheck: {
        usage: highlightCode(
          highlighter,
          {
            "sw.ts": {
              code: `import { responsesAreSame, defaultHeadersToCheck } from "@serwist/broadcast-update";

const cacheName = "api-cache";
const request = new Request("https://example.com/api");

const cache = await caches.open(cacheName);
const oldResponse = await cache.match(request);
const newResponse = await fetch(request);

if (!responsesAreSame(oldResponse, newResponse, defaultHeadersToCheck)) {
  const windows = await self.clients.matchAll({ type: "window" });
  for (const win of windows) {
    win.postMessage({ type: "CACHE_UPDATED", message: "Update now!" });
  }
}`,
              lang: "typescript",
            },
          },
          { idPrefix: "default-headers-to-check-usage" },
        ),
      },
    },
  };
};
