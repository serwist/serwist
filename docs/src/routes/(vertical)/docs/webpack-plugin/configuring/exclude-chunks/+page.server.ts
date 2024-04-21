import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "excludeChunks - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "excludeChunks",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
  toc: [
    {
      title: "excludeChunks",
      id: "exclude-chunks",
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
  excludeChunks: ["chunk-1", "chunk-2"],
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
