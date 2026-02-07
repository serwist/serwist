// @ts-check
import { withSerwist } from "@serwist/turbopack";

/** @type {import("next").NextConfig} */
const nextConfig = withSerwist({
  basePath: "/test",
  reactStrictMode: true,
});

export default nextConfig;
