import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "scope - Configuring - @serwist/next",
  ogImage: encodeOpenGraphImage({
    title: "scope",
    desc: "Configuring - @serwist/next",
  }),
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "next.config.mjs": {
          code: `withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  scope: "/foo/",
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
