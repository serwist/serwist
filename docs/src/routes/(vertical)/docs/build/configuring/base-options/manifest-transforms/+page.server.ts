import { highlightCode } from "$lib/highlightCode";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "manifestTransforms - Base options - Configuring - @serwist/build",
  code: {
    usage: highlightCode(
      locals.highlighter,
      {
        "build.ts": {
          code: `import { injectManifest, type ManifestTransform } from "@serwist/build";
// Build something...
// Bundle the service worker...
const manifestTransform: ManifestTransform = async (manifestEntries) => {
  const manifest = manifestEntries.map((m) => {
    if (m.url === "dQw4w9WgXcQ") m.url = "get-rick-rolled.mp4";
    // Note: it is actually not recommended to do this if you use webpack because
    // @serwist/webpack-plugin handles it for you.
    if (m.revision === null) m.revision = crypto.randomUUID();
    return m;
  });
  return { manifest, warnings: [] };
};
const { count, size, warnings } = await injectManifest({
  swSrc: "app/sw.ts",
  swDest: "dist/sw.js",
  globDirectory: "dist/static",
  manifestTransforms: [manifestTransform],
});
if (warnings.length > 0) {
  console.warn("[@serwist/build] Oopsie, there are warnings from Serwist:", warnings);
}
console.log(\`[@serwist/build] Manifest injected: \${count} files, totaling \${size} bytes.\`);`,
          lang: "typescript",
        },
        "build.js": {
          code: `import { injectManifest } from "@serwist/build";
// Build something...
// Bundle the service worker...
// Note: just a fun example!
/** @type {import("@serwist/build").ManifestTransform} */
const manifestTransform = async (manifestEntries) => {
  const manifest = manifestEntries.map((m) => {
    if (m.url === "/dQw4w9WgXcQ") m.url = "https://youtube.com/watch?v=dQw4w9WgXcQ";
    if (m.revision === null) m.revision = crypto.randomUUID();
    return m;
  });
  return { manifest, warnings: [] };
};
const { count, size, warnings } = await injectManifest({
  swSrc: "app/sw.js",
  swDest: "dist/sw.js",
  globDirectory: "dist/static",
  manifestTransforms: [manifestTransform],
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
