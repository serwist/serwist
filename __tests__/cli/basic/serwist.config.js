/** @type {import("@serwist/build").InjectManifestOptions} */
export default {
  swSrc: "service-worker/index.js",
  swDest: "dist/service-worker.js",
  globDirectory: "public",
  globPatterns: ["**/*.{js,css,html,png}"],
};
