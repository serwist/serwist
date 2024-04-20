import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "dontCacheBustURLsMatching - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "dontCacheBustURLsMatching",
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
  // NOTE: THE SERWIST TEAM IS NOT THAT GOOD AT REGEXPS. JUST KNOW THAT.
  dontCacheBustURLsMatching: /^dist\\/static\\/([a-zA-Z0-9]+)\\.([a-z0-9]+)\\.(css|js)$/,
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
