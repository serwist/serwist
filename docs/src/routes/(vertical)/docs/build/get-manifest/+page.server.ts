import { highlightCode } from "$lib/highlightCode";
import { getHighlighter } from "shiki";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const highlighter = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["typescript", "javascript"],
  });
  return {
    title: "GetManifest - @serwist/build",
    code: {
      gettingStarted: highlightCode(
        highlighter,
        {
          "build.js": {
            code: `import { getManifest } from "@serwist/build";
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
            lang: "javascript",
          },
        },
        { idPrefix: "getting-started" },
      ),
    },
  };
};
