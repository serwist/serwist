import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "maximumFileSizeToCacheInBytes - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "maximumFileSizeToCacheInBytes",
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
  // Bomb has been planted
  maximumFileSizeToCacheInBytes: 7355608,
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
