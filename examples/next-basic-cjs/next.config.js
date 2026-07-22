// @ts-check
const { spawnSync } = require("node:child_process");

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Using `git rev-parse HEAD` might not the most efficient
// way of determining a revision. You may prefer to use
// the hashes of every extra file you precache.
const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout ?? crypto.randomUUID();

module.exports = async () => {
  const withSerwist = (await import("@serwist/next")).default({
    cacheOnNavigation: true,
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    additionalPrecacheEntries: [{ url: "/~offline", revision }],
  });
  return withSerwist(nextConfig);
};
