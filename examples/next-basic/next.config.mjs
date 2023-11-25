// @ts-check
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  // @ts-expect-error investigate globDirectory later.
  workboxOptions: {
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
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
