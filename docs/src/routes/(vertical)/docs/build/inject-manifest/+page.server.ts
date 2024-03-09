import { highlightCode } from "$lib/highlightCode";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "InjectManifest - @serwist/build",
  ogImage: {
    title: "InjectManifest",
    desc: "@serwist/build",
  },
  code: {
    gettingStarted: highlightCode(
      locals.highlighter,
      {
        "build.js": {
          code: `import { injectManifest } from "@serwist/build";
// Build something...
// Bundle the service worker...
const { count, size, warnings } = await injectManifest({
  swSrc: "app/sw.js",
  swDest: "dist/sw.js",
  globDirectory: "dist/static",
});
if (warnings.length > 0) {
  console.warn("[@serwist/build] Oopsie, there are warnings from Serwist:", warnings);
}
console.log(\`[@serwist/build] Manifest injected: \${count} files, totaling \${size} bytes.\`);`,
          lang: "typescript",
        },
      },
      { idPrefix: "getting-started" },
    ),
  },
});
