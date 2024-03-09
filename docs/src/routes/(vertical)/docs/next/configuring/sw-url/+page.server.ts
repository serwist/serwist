import { highlightCode } from "$lib/highlightCode";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "swUrl - Configuring - @serwist/next",
  ogImage: {
    title: "swUrl",
    desc: "Configuring - @serwist/next",
  },
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "next.config.mjs": {
          code: `import withSerwistInit from "@serwist/next";
      
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/weird-sw.js",
  swUrl: "/weird-sw.js",
});
         
export default withSerwist({
  // Your Next.js config
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
