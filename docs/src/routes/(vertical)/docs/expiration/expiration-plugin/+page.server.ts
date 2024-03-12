import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "ExpirationPlugin - @serwist/expiration",
  ogImage: encodeOpenGraphImage({
    title: "ExpirationPlugin",
    desc: "@serwist/expiration-plugin",
  }),
  toc: [
    {
      title: "ExpirationPlugin",
      id: "expiration-plugin",
      children: [
        {
          title: "First added",
          id: "first-added",
        },
        {
          title: "About",
          id: "about",
        },
        {
          title: "Options",
          id: "options",
        },
        {
          title: "Methods and fields",
          id: "methods-and-fields",
        },
        {
          title: "Usage",
          id: "usage",
        },
      ],
    },
  ],
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "sw.ts": {
          code: `import { registerRoute } from "@serwist/routing";
import { CacheFirst } from "@serwist/strategies";
import { ExpirationPlugin } from "@serwist/expiration";

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  }),
);`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage" },
    ),
  },
});
