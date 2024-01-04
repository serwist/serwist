import shiki from "shiki";

import { highlightCode } from "$lib/highlightCode";

export const load = async () => {
  const highligher = await shiki.getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["javascript"],
  });
  return {
    title: "reloadOnOnline - Configuring - @serwist/next",
    code: {
      usage: highlightCode(
        highligher,
        {
          "next.config.mjs": {
            code: `import withSerwistInit from "@serwist/next";
      
const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    reloadOnOnline: true,
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
    reloadOnOnline: true,
});

module.exports = withSerwist({
    // Your Next.js config
});`,
            lang: "javascript",
          },
        },
        { idPrefix: "usage-example" }
      ),
    },
  };
};
