import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "CacheOnly - The Serwist API - serwist",
  ogImage: encodeOpenGraphImage({
    title: "CacheOnly",
    desc: "The Serwist API - serwist",
  }),
  toc: [
    {
      title: "CacheOnly",
      id: "cache-only",
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
          code: `import { CacheOnly, Serwist } from "serwist";

const serwist = new Serwist({
  runtimeCaching: [
    {
      matcher: ({ url }) => url.pathname.startsWith("/app/v2/"),
      handler: new CacheOnly(),
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
