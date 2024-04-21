import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "NetworkFirst - Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "NetworkFirst",
    desc: "Caching strategies - Runtime caching - serwist",
  }),
  toc: [
    {
      title: "NetworkFirst",
      id: "network-first",
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
          code: `import { NetworkFirst, Serwist } from "serwist";

const serwist = new Serwist({
  runtimeCaching: [
    {
      matcher: ({ url }) => url.pathname.startsWith("/social-timeline/"),
      handler: new NetworkFirst(),
    },
  ],
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
