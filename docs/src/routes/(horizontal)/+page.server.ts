import { highlightCode } from "$lib/highlightCode";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Home",
  code: {
    next: highlightCode(
      locals.highlighter,
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
          code: `const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  /** @type {import("next").NextConfig} */
  const nextConfig = {};

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import("@serwist/next")).default({
      // Note: This is only an example. If you use Pages Router,
      // use something else that works, such as "service-worker/index.ts".
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
};`,
          lang: "javascript",
        },
      },
      { idPrefix: "nextjs-config-showcase" },
    ),
    webpack: highlightCode(
      locals.highlighter,
      {
        "webpack.config.ts": {
          code: `import fs from "node:fs";
import path from "node:path";

import { InjectManifest } from "@serwist/webpack-plugin";
import type { Configuration } from "webpack";

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
} satisfies Configuration;`,
          lang: "typescript",
        },
      },
      { idPrefix: "webpack-config-showcase" },
    ),
  },
});
