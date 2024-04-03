import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Constants - Broadcasting cache updates - @serwist/sw/plugins",
  ogImage: encodeOpenGraphImage({
    title: "Constants",
    desc: "Broadcasting cache updates - @serwist/sw/plugins",
  }),
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
              title: "BROADCAST_UPDATE_MESSAGE_META",
              id: "cache-updated-message-meta",
            },
            {
              title: "BROADCAST_UPDATE_MESSAGE_TYPE",
              id: "cache-updated-message-type",
            },
            {
              title: "BROADCAST_UPDATE_DEFAULT_HEADERS",
              id: "default-headers-to-check",
            },
          ],
        },
      ],
    },
  ],
  code: {
    cacheUpdatedMessageMeta: {
      usage: highlightCode(
        locals.highlighter,
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
    if (!updatedResponse) {
      return;
    }

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
        locals.highlighter,
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
    if (!updatedResponse) {
      return;
    }

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
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { responsesAreSame, defaultHeadersToCheck } from "@serwist/broadcast-update";

declare const self: ServiceWorkerGlobalScope;

const cacheName = "api-cache";
const request = new Request("https://example.com/api");

const cache = await caches.open(cacheName);
const oldResponse = await cache.match(request);
const newResponse = await fetch(request);

if (oldResponse && !responsesAreSame(oldResponse, newResponse, defaultHeadersToCheck)) {
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
});
