import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "CacheableResponsePlugin - Setting cacheability criteria - @serwist/sw/plugins",
  ogImage: encodeOpenGraphImage({
    title: "CacheableResponsePlugin",
    desc: "Setting cacheability criteria - @serwist/sw/plugins",
  }),
  toc: [
    {
      title: "CacheableResponsePlugin",
      id: "cacheable-response-plugin",
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
          code: `import { CacheableResponsePlugin } from "@serwist/sw/plugins";
import { registerRoute } from "@serwist/sw/routing";
import { StaleWhileRevalidate } from "@serwist/sw/strategies";

registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
        headers: {
          "X-Is-Cacheable": "true",
        },
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
