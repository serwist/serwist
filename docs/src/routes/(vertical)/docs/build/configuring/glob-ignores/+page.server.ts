import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "globIgnores - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "globIgnores",
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
  globIgnores: ["**\\/node_modules\\/**\\/*"],
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
