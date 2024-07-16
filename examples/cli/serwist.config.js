/** @type {import("@serwist/build").InjectManifestOptions} */
export default {
  globDirectory: "static",
  globPatterns: ["**/*.{ico,html}"],
  swSrc: "src/sw.js",
  swDest: "tmp/sw.js",
};
