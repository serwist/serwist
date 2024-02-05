// @ts-check
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
};
