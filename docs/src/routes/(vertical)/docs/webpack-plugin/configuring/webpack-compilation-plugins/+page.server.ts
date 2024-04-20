import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "webpackCompilationPlugins - Configuring - @serwist/webpack-plugin",
  ogImage: encodeOpenGraphImage({
    title: "webpackCompilationPlugins",
    desc: "Configuring - @serwist/webpack-plugin",
  }),
  toc: [
    {
      title: "webpackCompilationPlugins",
      id: "webpack-compilation-plugins",
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
  webpackCompilationPlugins: [
    webpack.DefinePlugin({
      __BUILD_TIME__: webpack.DefinePlugin.runtimeValue(Date.now, {
        fileDependencies: [path.resolve(__dirname, "sample.txt")],
      }),
      __BUILD_VERSION__: 15,
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
