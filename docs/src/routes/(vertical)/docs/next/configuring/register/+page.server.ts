import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "register - Configuring - @serwist/next",
  ogImage: encodeOpenGraphImage({
    title: "register",
    desc: "Configuring - @serwist/next",
  }),
  code: {
    usage: {
      config: highlightCode(
        locals.highlighter,
        {
          "next.config.mjs": {
            code: `withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  register: false,
});`,
            lang: "javascript",
          },
        },
        { idPrefix: "usage-config-example", useTwoslash: false },
      ),
      app: highlightCode(
        locals.highlighter,
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
        { idPrefix: "usage-app-example", useTwoslash: false },
      ),
    },
  },
});
