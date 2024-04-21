import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "responsesAreSame - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "responsesAreSame",
    desc: "The Serwist API - serwist",
  }),
  toc: [
    {
      title: "responsesAreSame",
      id: "responses-are-same",
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
          title: "Parameters",
          id: "parameters",
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
          code: `import { responsesAreSame, BROADCAST_UPDATE_DEFAULT_HEADERS } from "serwist";

declare const self: ServiceWorkerGlobalScope;

const cacheName = "api-cache";
const request = new Request("https://example.com/api");

const cache = await caches.open(cacheName);
const oldResponse = await cache.match(request);
const newResponse = await fetch(request);

if (oldResponse && !responsesAreSame(oldResponse, newResponse, BROADCAST_UPDATE_DEFAULT_HEADERS)) {
  const windows = await self.clients.matchAll({ type: "window" });
  for (const win of windows) {
    win.postMessage({ type: "CACHE_UPDATED", message: "Update now!" });
  }
}`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
