import { getHighlighter } from "shiki";

import { highlightCode } from "$lib/highlightCode";

export const load = async () => {
  const highligher = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["javascript"],
  });
  return {
    title: "disablePrecacheManifest - Base options - Configuring - @serwist/build",
    code: {
      usage: highlightCode(
        highligher,
        {
          "build.js": {
            code: `import { injectManifest } from "@serwist/build";
// Build something...
// Bundle the service worker...
const isDev = process.env.NODE_ENV === "development";
const { count, size, warnings } = await injectManifest({
  swSrc: "app/sw.ts",
  swDest: "dist/sw.js",
  globDirectory: "dist/static",
  disablePrecacheManifest: isDev,
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
  };
};
