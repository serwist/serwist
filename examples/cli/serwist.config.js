/** @type {import("@serwist/build").InjectManifestOptions} */
export default {
  swSrc: "src/sw.js",
  swDest: "tmp/sw.js",
  globDirectory: "static",
  globPatterns: ["**/*.{html,css,js,ico}"],
};
