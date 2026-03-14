import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants.js";

export const loadNextConfig = async (cwd: string, isDev: boolean) => {
  const nextPhase = isDev ? PHASE_DEVELOPMENT_SERVER : PHASE_PRODUCTION_BUILD;
  // webpackIgnore is only supported by Next.js 15 and above, but it is necessary
  // for loading `next/dist/server/config.js`.
  const nextConfig = await import(/* webpackIgnore: true */ "next/dist/server/config.js");
  // 1) what does `default.default` even mean
  const loadConfig =
    typeof nextConfig.default === "function" ? (nextConfig.default as unknown as typeof nextConfig.default.default) : nextConfig.default.default;
  return loadConfig(nextPhase, cwd, { silent: false });
};

export const generateGlobPatterns = (distDir: string) => [
  `${distDir}static/**/*.{js,css,html,ico,apng,png,avif,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,webp,json,webmanifest}`,
  "public/**/*",
];
