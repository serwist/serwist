import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Caching strategies",
    desc: "Runtime caching - serwist",
  }),
  toc: [
    {
      title: "Caching strategies",
      id: "caching-strategies",
      children: [
        {
          title: "Introduction",
          id: "introduction",
        },
        {
          title: "Built-in strategies",
          id: "built-in-strategies",
        },
        {
          title: "Using plugins",
          id: "using-plugins",
        },
        {
          title: "Creating a new strategy",
          id: "custom-strategy",
        },
        {
          title: "Using a strategy in your custom fetch logic",
          id: "strategy-custom-fetch",
        },
      ],
    },
  ],
  code: {
    customStrategy: {
      networkOnly: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { Strategy, type StrategyHandler } from "serwist";

class NetworkOnly extends Strategy {
  _handle(request: Request, handler: StrategyHandler) {
    return handler.fetch(request);
  }
}`,
            lang: "typescript",
          },
        },
        { idPrefix: "writing-a-custom-strategy-network-only" },
      ),
      cacheNetworkRace: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { Strategy, type StrategyHandler } from "serwist";

class CacheNetworkRace extends Strategy {
  _handle(request: Request, handler: StrategyHandler) {
    const fetchAndCachePutDone = handler.fetchAndCachePut(request);
    const cacheMatchDone = handler.cacheMatch(request);

    return new Promise<Response>((resolve, reject) => {
      fetchAndCachePutDone.then(resolve);
      cacheMatchDone.then((response) => {
        if (response) {
          resolve(response);
        }
      });

      // Reject if both network and cache error or find no response.
      Promise.allSettled([fetchAndCachePutDone, cacheMatchDone]).then((results) => {
        const [fetchAndCachePutResult, cacheMatchResult] = results;
        if (fetchAndCachePutResult.status === "rejected" && (cacheMatchResult.status === "rejected" || !cacheMatchResult.value)) {
          reject(fetchAndCachePutResult.reason);
        }
      });
    });
  }
}`,
            lang: "typescript",
          },
        },
        { idPrefix: "writing-a-custom-strategy-cache-network-race" },
      ),
    },
    customFetch: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { StaleWhileRevalidate } from "serwist";

declare const self: ServiceWorkerGlobalScope;

const swr = new StaleWhileRevalidate();

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === location.origin && url.pathname === "/") {
    event.respondWith(swr.handle({ event, request }));
  }
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "strategy-custom-fetch" },
    ),
  },
});
