import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "StaleWhileRevalidate - Caching strategies - Runtime caching - serwist",
  ogImage: encodeOpenGraphImage({
    title: "StaleWhileRevalidate",
    desc: "Caching strategies - Runtime caching - serwist",
  }),
  toc: [
    {
      title: "StaleWhileRevalidate",
      id: "stale-while-revalidate",
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
          code: `import { StaleWhileRevalidate, Serwist } from "serwist";

const serwist = new Serwist({
  runtimeCaching: [
    {
      matcher: ({ url }) => url.pathname.startsWith("/images/avatars/"),
      handler: new StaleWhileRevalidate(),
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
