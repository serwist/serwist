import { highlightCode } from "$lib/highlightCode";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "disable - Configuring - @serwist/next",
  ogImage: {
    title: "disable",
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
  swDest: "public/sw.js",
  disable: true,
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
