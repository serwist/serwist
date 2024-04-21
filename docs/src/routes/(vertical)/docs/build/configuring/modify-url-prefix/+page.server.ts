import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "modifyURLPrefix - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "modifyURLPrefix",
    desc: "Configuring - @serwist/build",
  }),
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "build.js": {
          code: `await injectManifest({
  swSrc: "app/sw.ts",
  swDest: "dist/sw.js",
  globDirectory: "dist/static",
  modifyURLPrefix: {
    // hi-mom/index.GdhNyhN1.js -> index.GdhNyhN1.js
    "hi-mom/": "",
  },
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
