// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";

import withSerwistInit from "@serwist/next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withSerwist = withSerwistInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  buildOptions: {
    swSrc: path.join(__dirname, "app/sw.ts"),
    swDest: path.join(__dirname, "public/sw.js"),
  },
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withSerwist(nextConfig);
