// @ts-check
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// You may want to use a more robust revision to cache
// files more efficiently.
// A viable option is `git rev-parse HEAD`.
const revision = crypto.randomUUID();

module.exports = async () => {
  const withSerwist = (await import("@serwist/next")).default({
    cacheOnNavigation: true,
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    additionalPrecacheEntries: [{ url: "/~offline", revision }],
  });
  return withSerwist(nextConfig);
};
