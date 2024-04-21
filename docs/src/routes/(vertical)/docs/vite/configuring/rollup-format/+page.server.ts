import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "rollupFormat - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "rollupFormat",
    desc: "Configuring - @serwist/vite",
  }),
  toc: [
    {
      title: "rollupFormat",
      id: "rollup-format",
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
        {
          title: "More resources",
          id: "more-resources",
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
      rollupFormat: "iife",
      type: "classic",
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
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
