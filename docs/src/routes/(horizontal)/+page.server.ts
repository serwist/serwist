import highlightjs from "highlight.js/lib/core";

import type { PageServerLoad } from "./$types";

highlightjs.registerLanguage("javascript", (await import("highlight.js/lib/languages/javascript")).default);

export const load: PageServerLoad = () => {
  return {
    code: {
      next: {
        configMjs: highlightjs.highlight(
          `import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});
   
export default withSerwist({
    // Your Next.js config
});`,
          { language: "javascript" }
        ).value,
        configJs: highlightjs.highlight(
          `const withSerwist = require("@serwist/next").default({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});

module.exports = withSerwist({
    // Your Next.js config
});`,
          { language: "javascript" }
        ).value,
      },
      webpack: {
        configJs: highlightjs.highlight(
          `import fs from "node:fs";
import path from "node:path";

import { InjectManifest } from "@serwist/webpack-plugin";

const dev = process.env.NODE_ENV === "development";
const rootDir = fs.realpathSync(process.cwd());
const srcDir = path.join(rootDir, "src");
const destDir = path.join(rootDir, "dist");

const clientEntry = path.resolve(srcDir, "client.ts");

export default {
  target: "web",
  name: "client",
  module: {
    rules: [
      // Insert rules...
    ],
  },
  entry: clientEntry,
  output: {
    publicPath: "/",
    path: path.resolve(destDir, "public"),
    filename: "static/js/[name]-[contenthash:8].js",
    chunkFilename: "static/js/[name]-[contenthash:8].chunk.js",
    assetModuleFilename: "static/media/[name].[hash][ext]",
  },
  plugins: [
    // swDest is automatically resolved to "$\{output.path}/sw.js"
    new InjectManifest({
      swSrc: path.resolve(rootDir, "src/sw.ts"),
      disablePrecacheManifest: dev,
      additionalPrecacheEntries: !dev
        ? [
            // Insert something...
          ]
        : undefined,
    }),
  ],
};
`,
          {
            language: "javascript",
          }
        ).value,
      },
    },
  };
};
