import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "ExpirationPlugin - Expiring outdated responses - @serwist/sw/plugins",
  ogImage: encodeOpenGraphImage({
    title: "ExpirationPlugin",
    desc: "Expiring outdated responses - @serwist/sw/plugins",
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
          code: `import { ExpirationPlugin } from "@serwist/sw/plugins";
import { registerRoute } from "@serwist/sw/routing";
import { CacheFirst } from "@serwist/sw/strategies";

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
