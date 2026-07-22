// @ts-check
import { withSerwist } from "@serwist/turbopack";

/** @type {import("next").NextConfig} */
const nextConfig = withSerwist({
  cacheComponents: true,
});

export default nextConfig;
