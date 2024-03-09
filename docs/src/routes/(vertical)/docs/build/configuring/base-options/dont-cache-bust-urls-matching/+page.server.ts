import { highlightCode } from "$lib/highlightCode";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "dontCacheBustURLsMatching - Base options - Configuring - @serwist/build",
  ogImage: {
    title: "dontCacheBustURLsMatching",
    desc: "Base options - Configuring - @serwist/build",
  },
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
  // NOTE: THE SERWIST TEAM IS NOT THAT GOOD AT REGEXPS. JUST KNOW THAT.
  dontCacheBustURLsMatching: /^dist\\/static\\/([a-zA-Z0-9]+)\\.([a-z0-9]+)\\.(css|js)$/,
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
