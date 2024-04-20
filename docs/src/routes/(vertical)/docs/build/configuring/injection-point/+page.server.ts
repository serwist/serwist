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
          code: `import { injectManifest } from "@serwist/build";
// Build something...
// Bundle the service worker...
const { count, size, warnings } = await injectManifest({
  swSrc: "app/sw.ts",
  swDest: "dist/sw.js",
  globDirectory: "dist/static",
  injectionPoint: "__HI_MOM",
});
if (warnings.length > 0) {
  console.warn("[@serwist/build] Oopsie, there are warnings from Serwist:", warnings);
}
console.log(\`[@serwist/build] Manifest injected: \${count} files, totaling \${size} bytes.\`);`,
          lang: "javascript",
        },
      },
      { idPrefix: "usage-example" },
    ),
  },
});
