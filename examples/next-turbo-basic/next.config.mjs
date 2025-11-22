// @ts-check
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["esbuild-wasm"],
};

export default nextConfig;
