import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "devOptions - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "devOptions",
    desc: "Configuring - @serwist/vite",
  }),
  toc: [
    {
      title: "devOptions",
      id: "dev-options",
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
        "vite.config.ts": {
          code: `export default defineConfig({
  plugins: [
    // Other plugins...
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
      devOptions: {
        bundle: false,
        minify: false,
      },
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
