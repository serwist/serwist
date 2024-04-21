import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Route - Routing - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "Route",
    desc: "Routing - Runtime caching - serwist",
  }),
  toc: [
    {
      title: "Route",
      id: "route",
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
          code: `import { CacheFirst, Route, Serwist } from "serwist";

const serwist = new Serwist();

serwist.registerRoute(new Route(({ request, sameOrigin }) => {
  return sameOrigin && request.destination === "image";
}, new CacheFirst()));

serwist.addEventListeners();`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
