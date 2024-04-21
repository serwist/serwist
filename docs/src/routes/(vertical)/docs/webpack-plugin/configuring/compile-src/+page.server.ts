import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "compileSrc - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "compileSrc",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
  toc: [
    {
      title: "compileSrc",
      id: "compile-src",
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
          title: "Default",
          id: "default",
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
        "webpack.config.js": {
          code: `new InjectManifest({
  compileSrc: false,
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
