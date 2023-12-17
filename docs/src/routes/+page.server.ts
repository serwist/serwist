import highlightjs from "highlight.js/lib/core";

import type { PageServerLoad } from "./$types";

highlightjs.registerLanguage("javascript", (await import("highlight.js/lib/languages/javascript")).default);

export const load: PageServerLoad = () => {
  return {
    code: {
      next: {
        configJs: highlightjs.highlight(
          `const withSerwist = require("@serwist/next").default({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});

module.exports = withSerwist({
    // Your Next.js config
});`,
          { language: "javascript" }
        ).value,
        configMjs: highlightjs.highlight(
          `import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});
   
export default withSerwist({
    // Your Next.js config
});`,
          { language: "javascript" }
        ).value,
      },
    },
  };
};
