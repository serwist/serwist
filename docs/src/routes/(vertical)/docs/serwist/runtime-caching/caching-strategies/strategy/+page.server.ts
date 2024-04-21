import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Strategy - Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Strategy",
    desc: "Caching strategies - Runtime caching - serwist",
  }),
  toc: [
    {
      title: "Strategy",
      id: "strategy",
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
          title: "Abstract methods",
          id: "abstract-methods",
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

class NetworkOnly extends Strategy {
  _handle(request: Request, handler: StrategyHandler) {
    return handler.fetch(request);
  }
}`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
