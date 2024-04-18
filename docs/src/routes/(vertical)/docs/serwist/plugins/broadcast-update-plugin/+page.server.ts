import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "BroadcastUpdatePlugin - Plugins - serwist",
  ogImage: encodeOpenGraphImage({
    title: "BroadcastUpdatePlugin",
    desc: "Plugins - serwist",
  }),
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
  ],
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { BroadcastUpdatePlugin, StaleWhileRevalidate } from "serwist";
import { registerRoute } from "serwist/legacy";

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    plugins: [new BroadcastUpdatePlugin()],
  }),
);`,
          lang: "typescript",
        },
        "message.ts": {
          code: `import { BROADCAST_UPDATE_MESSAGE_META } from "serwist";

navigator.serviceWorker.addEventListener("message", async (event) => {
  // Optional: ensure the message came from Serwist
  if (event.data.meta === BROADCAST_UPDATE_MESSAGE_META) {
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
      { idPrefix: "usage-example" },
    ),
  },
});
