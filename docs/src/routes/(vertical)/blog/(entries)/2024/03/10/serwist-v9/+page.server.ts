import { highlightCode } from "$lib/highlightCode";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  toc: [
    {
      title: "Serwist 9.0.0",
      id: "serwist-v9",
      children: [
        {
          title: "Misc changes",
          id: "misc",
          children: [
            {
              title: "Dropped the CommonJS build",
              id: "dropped-the-commonjs-build",
            },
            {
              title: "Bumped minimum supported TypeScript and Node.js versions",
              id: "bumped-minimum-supported-ts-node",
            },
            {
              title: "Ship TypeScript source",
              id: "ship-ts-source",
            },
          ],
        },
        {
          title: "Service worker packages' changes",
          id: "service-worker-packages-changes",
        },
        {
          title: "Build packages' changes",
          id: "build-packages-changes",
        },
      ],
    },
  ],
  code: {
    misc: {
      esmOnly: highlightCode(
        locals.highlighter,
        {
          Old: {
            code: `// @ts-check
const withSerwist = require("@serwist/next").default({
  cacheOnFrontEndNav: true,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withSerwist(nextConfig);`,
            lang: "typescript",
          },
          New: {
            code: `// @ts-check
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = async () => {
  const withSerwist = (await import("@serwist/next")).default({
    cacheOnNavigation: true,
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
  });
  return withSerwist(nextConfig);
};`,
            lang: "typescript",
          },
        },
        { idPrefix: "dropped-the-commonjs-build" },
      ),
      minimumSupportedTsNode: highlightCode(
        locals.highlighter,
        {
          bash: {
            code: `# Change to your preferred way of updating Node.js
nvm use --lts
# Change to your package manager
npm i -D typescript@latest`,
            lang: "bash",
          },
        },
        { idPrefix: "bumped-minimum-supported-ts-node" },
      ),
    },
  },
});
