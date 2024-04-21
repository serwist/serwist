import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Serwist - @serwist/window",
  ogImage: encodeOpenGraphImage({
    title: "Serwist",
    desc: "@serwist/window",
  }),
  toc: [
    {
      title: "Serwist",
      id: "serwist",
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
        "index.ts": {
          code: `declare const confirmUpdate: () => boolean;
// ---cut-before---          
import { Serwist } from "@serwist/window";

if ("serviceWorker" in navigator) {
  const serwist = new Serwist("/sw.js", { scope: "/", type: "classic" });

  serwist.addEventListener("waiting", () => {
    serwist.addEventListener("controlling", location.reload);
    if (confirmUpdate()) {
      serwist.messageSkipWaiting();
    }
  });

  void serwist.register();
}`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
