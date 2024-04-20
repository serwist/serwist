import { highlightCode } from "$lib/highlightCode";
import { encodeOpenGraphImage } from "$lib/og";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "globDirectory - Configuring - @serwist/build",
  ogImage: encodeOpenGraphImage({
    title: "globDirectory",
    desc: "Configuring - @serwist/build",
  }),
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
