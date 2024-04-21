import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Constants - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Constants",
    desc: "The Serwist API - serwist",
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
              title: "BROADCAST_UPDATE_DEFAULT_HEADERS",
              id: "default-headers-to-check",
            },
          ],
        },
      ],
    },
  ],
  code: {
    defaultHeadersToCheck: {
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
        { idPrefix: "default-headers-to-check-usage" },
      ),
    },
  },
});
