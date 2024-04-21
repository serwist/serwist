import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "plugins - Configuring - @serwist/vite",
  ogImage: encodeOpenGraphImage({
    title: "plugins",
    desc: "Configuring - @serwist/vite",
  }),
  toc: [
    {
      title: "plugins",
      id: "plugins",
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
          code: `import replace from "@rollup/plugin-replace";

export default defineConfig({
  plugins: [
    // Other plugins...
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
      plugins: [
        replace({
          __BUILD_DATE__: () => JSON.stringify(new Date()),
          __BUILD_VERSION__: 15,
        }),
      ],
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
