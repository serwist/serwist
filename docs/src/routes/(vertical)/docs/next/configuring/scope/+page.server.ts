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
          code: `import withSerwistInit from "@serwist/next";
      
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  scope: "/foo/",
});
         
export default withSerwist({
  // Your Next.js config
});`,
          lang: "javascript",
        },
        "next.config.js": {
          code: `const withSerwist = require("@serwist/next").default({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  scope: "/foo/",
});

module.exports = withSerwist({
  // Your Next.js config
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
