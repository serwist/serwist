import { highlightCode } from "$lib/highlightCode";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "GetManifest - @serwist/build",
  ogImage: {
    title: "GetManifest",
    desc: "@serwist/build",
  },
  code: {
    gettingStarted: highlightCode(
      locals.highlighter,
      {
        "build.js": {
          code: `// @filename: bundle.ts
export const bundleServiceWorker = async (options: unknown): Promise<unknown> => {
  return options;
};

// @filename: build.ts
// ---cut-before---
import { getManifest } from "@serwist/build";

import { bundleServiceWorker } from "./bundle";

// Build something...
const { manifestEntries, count, size, warnings } = await getManifest({
  globDirectory: "dist/static",
});
if (warnings.length > 0) {
  console.warn("[@serwist/build] Oopsie, there are warnings from Serwist:", warnings);
}
console.log(\`[@serwist/build] Manifest generated: \${count} files, totaling \${size} bytes.\`);

// Implement it yourself!
void bundleServiceWorker({
  swSrc: "app/sw.js",
  swDest: "dist/service-worker.js",
  define: {
    "self.__SW_MANIFEST": JSON.stringify(manifestEntries),
  },
});`,
          lang: "typescript",
        },
      },
      { idPrefix: "getting-started" },
    ),
  },
});
