import shiki from "shiki";

import { highlightCode } from "$lib/highlightCode";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const highlighter = await shiki.getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: ["javascript"],
  });
  return {
    title: "Home",
    code: {
      next: highlightCode(
        highlighter,
        {
          "next.config.mjs": {
            code: `import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});
   
export default withSerwist({
    // Your Next.js config
});`,
            lang: "javascript",
          },
          "next.config.js": {
            code: `const withSerwist = require("@serwist/next").default({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});

module.exports = withSerwist({
    // Your Next.js config
});`,
            lang: "javascript",
          },
        },
        { idPrefix: "nextjs-config-showcase" }
      ),
      webpack: highlightCode(
        highlighter,
        {
          "webpack.config.js": {
            code: `import fs from "node:fs";
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
            lang: "javascript",
          },
        },
        { idPrefix: "webpack-config-showcase" }
      ),
    },
  };
};
