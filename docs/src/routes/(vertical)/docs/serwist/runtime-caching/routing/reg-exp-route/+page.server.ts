import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "RegExpRoute - Routing - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "RegExpRoute",
    desc: "Routing - Runtime caching - serwist",
  }),
  toc: [
    {
      title: "RegExpRoute",
      id: "reg-exp-route",
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
          code: `import { NetworkFirst, RegExpRoute, Serwist } from "serwist";

const serwist = new Serwist();

serwist.registerRoute(new RegExpRoute(/^\\/api\\/.*/, new NetworkFirst(), "POST"));

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
