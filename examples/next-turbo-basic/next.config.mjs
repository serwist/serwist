// @ts-check
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["esbuild", "@esbuild/linux-x64"],
};

export default nextConfig;
