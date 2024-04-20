import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "chunks - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "chunks",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
  toc: [
    {
      title: "chunks",
      id: "chunks",
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
        "webpack.config.js": {
          code: `new InjectManifest({
  chunks: ["chunk-1", "chunk-2"],
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
