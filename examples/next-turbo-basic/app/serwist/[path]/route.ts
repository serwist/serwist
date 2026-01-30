import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";
import nextConfig from "../../../next.config.mjs";

// Using `git rev-parse HEAD` might not the most efficient
// way of determining a revision. You may prefer to use
// the hashes of every extra file you precache.
const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout ?? crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  swSrc: "app/sw.ts",
  nextConfig,
  useNativeEsbuild: true,
});
