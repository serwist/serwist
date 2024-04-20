import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "include - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "include",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
  toc: [
    {
      title: "include",
      id: "include",
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
  include: [
    /\\.(js|css|json)$/, 
    ({ asset }) => asset.name.startsWith("client/"),
  ],
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
