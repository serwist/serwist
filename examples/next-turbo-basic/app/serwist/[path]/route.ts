import { createSerwistRoute, serwist } from "@serwist/turbopack/cache";
import { spawnSync } from "node:child_process";

// Using `git rev-parse HEAD` might not the most efficient
// way of determining a revision. You may prefer to use
// the hashes of every extra file you precache.
const revision =
  spawnSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf-8",
  }).stdout.trim() ?? crypto.randomUUID();

const options = {
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  swSrc: "app/sw.ts",
  useNativeEsbuild: true,
};

export const { generateStaticParams, GET } = createSerwistRoute(
  process.env.NODE_ENV === "development"
    ? () => serwist(options)
    : async () => {
        "use cache";
        return serwist(options);
      },
);
