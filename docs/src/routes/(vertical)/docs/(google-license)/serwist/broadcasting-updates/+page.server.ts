import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Broadcasting cache updates",
  ogImage: encodeOpenGraphImage({
    title: "Broadcasting cache updates",
    desc: "serwist/plugins",
  }),
  toc: [
    {
      title: "Broadcasting cache updates",
      id: "broadcasting-updates",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "How are updates determined?",
          id: "how-are-updates-determined",
        },
        {
          title: "Message format",
          id: "message-format",
        },
        {
          title: "Basic usage",
          id: "basic-usage",
          children: [
            {
              title: "Customizing the list of headers to check",
              id: "customize-headers-to-check",
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
    messageFormat: highlightCode(
      locals.highlighter,
      {
        "event.data": {
          code: `import type { BroadcastMessage } from "serwist/plugins";

const data = {
  type: "CACHE_UPDATED",
  meta: "serwist-broadcast-update",
  // The two payload values vary depending on the actual update:
  payload: {
    cacheName: "the-cache-name",
    updatedURL: "https://example.com/",
  },
} satisfies BroadcastMessage;`,
          lang: "typescript",
        },
      },
      { idPrefix: "message-format" },
    ),
    basicUsage: {
      setup: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BroadcastUpdatePlugin } from "serwist/plugins";
import { registerRoute } from "serwist/legacy";
import { StaleWhileRevalidate } from "serwist/strategies";

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    plugins: [new BroadcastUpdatePlugin()],
  }),
);`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "basic-usage",
        },
      ),
      eventListener: highlightCode(
        locals.highlighter,
        {
          "message.ts": {
            code: `import { BROADCAST_UPDATE_MESSAGE_META } from "serwist/plugins";

navigator.serviceWorker.addEventListener("message", async (event) => {
  // Optional: ensure the message came from Serwist
  if (event.data.meta === BROADCAST_UPDATE_MESSAGE_META) {
    const { cacheName, updatedURL } = event.data.payload;

    // Do something with cacheName and updatedURL.
    // For example, get the cached content and update
    // the content on the page.
    const cache = await caches.open(cacheName);
    const updatedResponse = await cache.match(updatedURL);
    if (updatedResponse) {
      const updatedText = await updatedResponse.text();
      // Do something with the updated content...
    }
  }
});`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "basic-usage-event-listener",
        },
      ),
      customizeHeaders: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BroadcastUpdatePlugin, BROADCAST_UPDATE_DEFAULT_HEADERS } from "serwist/plugins";
import { registerRoute } from "serwist/legacy";
import { StaleWhileRevalidate } from "serwist/strategies";

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    plugins: [
      new BroadcastUpdatePlugin({
        headersToCheck: [...BROADCAST_UPDATE_DEFAULT_HEADERS, "X-My-Custom-Header"],
      }),
    ],
  }),
);`,
            lang: "typescript",
          },
        },
        { idPrefix: "basic-usage-customize-headers" },
      ),
    },
    advancedUsage: {
      notifyIfUpdated: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { BroadcastCacheUpdate, BROADCAST_UPDATE_DEFAULT_HEADERS } from "serwist/plugins";

declare const self: ServiceWorkerGlobalScope;

const broadcastUpdate = new BroadcastCacheUpdate({
  headersToCheck: [...BROADCAST_UPDATE_DEFAULT_HEADERS, "X-My-Custom-Header"],
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cacheName = "api-cache";
      const request = new Request("https://example.com/api");
      
      const cache = await caches.open(cacheName);
      const oldResponse = await cache.match(request);

      // Is the cached response stale?
      const shouldRevalidate = true;

      if (!shouldRevalidate && oldResponse) {
        return oldResponse;
      }

      const newResponse = await fetch(request);

      broadcastUpdate.notifyIfUpdated({
        cacheName,
        oldResponse,
        newResponse,
        request,
        event,
      });

      return newResponse;
    })(),
  );
});`,
            lang: "typescript",
          },
        },
        {
          idPrefix: "advanced-usage",
        },
      ),
    },
  },
});
