import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "exclude - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "exclude",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
  toc: [
    {
      title: "exclude",
      id: "exclude",
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
  exclude: [
    /\\.map$/, 
    /^manifest.*\\.js$/,
    ({ asset }) => asset.name.startsWith("server/"),
  ],
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
