// @ts-check
const path = require("node:path");
const { injectManifest } = require("@serwist/build");

(async () => {
  const { count, size, warnings } = await injectManifest({
    swSrc: path.join(__dirname, "service-worker/index.js"),
    swDest: path.join(__dirname, "dist/service-worker.js"),
    globDirectory: path.join(__dirname, "public"),
    globPatterns: ["**/*.{js,css,html,png}"],
  });

  if (warnings.length > 0) {
    console.warn(
      "[@serwist/build] Oopsie, there are warnings from Serwist:",
      warnings
    );
  }
  console.log(
    `[@serwist/build] Manifest injected: ${count} files, totaling ${size} bytes.`
  );
})();
