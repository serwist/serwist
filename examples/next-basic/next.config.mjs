import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default withSerwist(nextConfig);
