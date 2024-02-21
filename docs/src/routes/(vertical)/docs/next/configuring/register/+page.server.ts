import { highlightCode } from "$lib/highlightCode";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "register - Configuring - @serwist/next",
  code: {
    usage: {
      config: highlightCode(
        locals.highlighter,
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
        },
        { idPrefix: "usage-config-example" },
      ),
      app: highlightCode(
        locals.highlighter,
        {
          "app/register-pwa.jsx": {
            code: `// @filename: register-pwa.jsx
/// <reference types="@serwist/next/typings" />
// ---cut-before---
"use client";
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
});
