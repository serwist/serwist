import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants.js";
import type { NextConfigComplete } from "next/dist/server/config-shared.js";

import nextConfig = require("next/dist/server/config.js");

export const loadNextConfig = (cwd: string, isDev: boolean): Promise<NextConfigComplete> => {
  const nextPhase = isDev ? PHASE_DEVELOPMENT_SERVER : PHASE_PRODUCTION_BUILD;
  return nextConfig.default(nextPhase, cwd, {
    silent: false,
  });
};

export const generateGlobPatterns = (distDir: string): string[] => [
  `${distDir}static/**/*.{js,css,html,ico,apng,png,avif,jpg,jpeg,jfif,pjpeg,pjp,gif,svg,webp,json,webmanifest}`,
  "public/**/*",
];
