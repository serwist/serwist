import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "disable - Configuring - @serwist/next",
  ogImage: encodeOpenGraphImage({
    title: "disable",
    desc: "Configuring - @serwist/next",
  }),
  toc: [
    {
      title: "disable",
      id: "disable",
      children: [
        {
          title: "First added",
          id: "first-added",
        },
        {
          title: "Default",
          id: "default",
        },
        {
          title: "About",
          id: "about",
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
        "next.config.mjs": {
          code: `withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: true,
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
