import { getHighlighter } from "shiki";

import { highlightCode } from "$lib/highlightCode";

export const load = async () => {
  const highligher = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["javascript", "jsx"],
  });
  return {
    title: "register - Configuring - @serwist/next",
    code: {
      usage: {
        config: highlightCode(
          highligher,
          {
            "next.config.mjs": {
              code: `import withSerwistInit from "@serwist/next";
      
const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    register: false,
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
    cacheOnFrontEndNav: true,
});
      
module.exports = withSerwist({
    // Your Next.js config
});`,
              lang: "javascript",
            },
          },
          { idPrefix: "usage-config-example" },
        ),
        app: highlightCode(
          highligher,
          {
            "app/register-pwa.jsx": {
              code: `"use client";
import { useEffect } from "react";

export default function RegisterPWA() {
  useEffect(() => {
    if ("serviceWorker" in navigator && window.serwist !== undefined) {
      window.serwist.register();
    }
  }, []);
  return <></>;
}`,
              lang: "jsx",
            },
          },
          { idPrefix: "usage-app-example" },
        ),
      },
    },
  };
};
