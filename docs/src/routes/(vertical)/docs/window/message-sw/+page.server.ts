import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "messageSW - @serwist/window",
  ogImage: encodeOpenGraphImage({
    title: "messageSW",
    desc: "@serwist/window",
  }),
  toc: [
    {
      title: "messageSW",
      id: "message-sw",
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
      ],
    },
  ],
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "index.ts": {
          code: `declare const sw: ServiceWorker;
// ---cut-before---
import { messageSW } from "@serwist/window";

const swVersion = await messageSW(sw, { type: "GET_VERSION" });

console.log("Service worker version:", swVersion);`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
