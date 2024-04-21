import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "scope - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "scope",
    desc: "Configuring - @serwist/vite",
  }),
  toc: [
    {
      title: "scope",
      id: "scope",
      children: [
        {
          title: "First added",
          id: "first-added",
        },
        {
          title: "Default",
          id: "default",
        },
        {
          title: "About",
          id: "about",
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
        "vite.config.ts": {
          code: `export default defineConfig({
  plugins: [
    // Other plugins...
    serwist({
      scope: "/foo/",
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
    }),
  ],
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
