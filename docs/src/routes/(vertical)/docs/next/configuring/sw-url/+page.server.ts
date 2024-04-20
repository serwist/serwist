import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "swUrl - Configuring - @serwist/next",
  ogImage: encodeOpenGraphImage({
    title: "swUrl",
    desc: "Configuring - @serwist/next",
  }),
  toc: [
    {
      title: "swUrl",
      id: "sw-url",
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
          title: "Why?",
          id: "why",
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
  swDest: "public/weird-sw.js",
  swUrl: "/weird-sw.js",
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
