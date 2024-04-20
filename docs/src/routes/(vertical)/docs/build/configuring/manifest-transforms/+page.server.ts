import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "manifestTransforms - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "manifestTransforms",
    desc: "Configuring - @serwist/build",
  }),
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "build.ts": {
          code: `const manifestTransform: ManifestTransform = async (manifestEntries) => {
  const manifest = manifestEntries.map((m) => {
    if (m.url === "dQw4w9WgXcQ") m.url = "get-rick-rolled.mp4";
    if (m.revision === null) m.revision = crypto.randomUUID();
    return m;
  });
  return { manifest, warnings: [] };
};
await injectManifest({
  swSrc: "app/sw.ts",
  swDest: "dist/sw.js",
  globDirectory: "dist/static",
  manifestTransforms: [manifestTransform],
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "usage-example", useTwoslash: false },
    ),
  },
});
