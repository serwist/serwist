import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "StrategyHandler - Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "StrategyHandler",
    desc: "Caching strategies - Runtime caching - serwist",
  }),
  toc: [
    {
      title: "StrategyHandler",
      id: "strategy-handler",
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
          title: "Methods and fields",
          id: "methods-and-fields",
        },
        {
          title: "Usage",
          id: "usage",
        },
        {
          title: "More resources",
          id: "more-resources",
        },
      ],
    },
  ],
  code: {
    usage: highlightCode(
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
      { idPrefix: "usage-example" },
    ),
  },
});
