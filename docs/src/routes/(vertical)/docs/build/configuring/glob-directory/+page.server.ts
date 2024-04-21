import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "globDirectory - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "globDirectory",
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
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
