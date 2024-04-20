import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "injectionPoint (InjectManifest only) - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "injectionPoint (InjectManifest only)",
    desc: "Configuring - @serwist/build",
  }),
  toc: [
    {
      title: "injectionPoint (InjectManifest only)",
      id: "injection-point",
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
      ],
    },
  ],
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "build.js": {
          code: `await injectManifest({
  swSrc: "app/sw.ts",
  swDest: "dist/sw.js",
  globDirectory: "dist/static",
  injectionPoint: "__HI_MOM",
});`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
