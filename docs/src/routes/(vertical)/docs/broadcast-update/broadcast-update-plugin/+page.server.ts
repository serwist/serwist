import { highlightCode } from "$lib/highlightCode";
import type { TocEntry } from "$lib/types";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "BroadcastUpdatePlugin - @serwist/broadcast-update",
  toc: [
    {
      title: "BroadcastUpdatePlugin",
      id: "broadcast-update-plugin",
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
          title: "Usage",
          id: "usage",
        },
      ],
    },
  ] satisfies TocEntry[],
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { registerRoute } from "@serwist/routing";
import { StaleWhileRevalidate } from "@serwist/strategies";
import { BroadcastUpdatePlugin } from "@serwist/broadcast-update";

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    plugins: [new BroadcastUpdatePlugin()],
  }),
);`,
          lang: "typescript",
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
    if (updatedResponse) {
      const updatedText = await updatedResponse.text();
    }
  }
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
