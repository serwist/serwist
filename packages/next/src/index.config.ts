import fs from "node:fs";
import path from "node:path";
import { rebasePath } from "@serwist/build";
import type { BuildOptions } from "@serwist/cli";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants.js";
import type { SerwistOptions } from "./lib/config/types.js";
import { generateGlobPatterns } from "./lib/config/utils.js";

import loadNextConfig = require("next/dist/server/config.js");

export const serwist = async (options: SerwistOptions): Promise<BuildOptions> => {
  const isDev = process.env.NODE_ENV === "development";
  const nextPhase = isDev ? PHASE_DEVELOPMENT_SERVER : PHASE_PRODUCTION_BUILD;
  const config = await loadNextConfig.default(nextPhase, process.cwd(), {
    silent: false,
  });
  const basePath = config.basePath || "/";
  let distDir = config.distDir;
  if (distDir[0] === "/") distDir = distDir.slice(1);
  if (distDir[distDir.length - 1] !== "/") distDir += "/";
  const distServerDir = `${distDir}server/`;
  const distAppDir = `${distServerDir}app/`;
  const distPagesDir = `${distServerDir}pages/`;
  const { precachePrerendered = true, globDirectory = process.cwd(), ...cliOptions } = options;
  for (const file of [cliOptions.swDest, `${cliOptions.swDest}.map`]) {
    fs.rmSync(file, { force: true });
  }
  return {
    dontCacheBustURLsMatching: new RegExp(`^${distDir}static/`),
    disablePrecacheManifest: isDev,
    ...cliOptions,
    globDirectory,
    globPatterns: [
      ...(cliOptions.globPatterns ?? generateGlobPatterns(distDir)),
      ...(precachePrerendered ? [`${distServerDir}{app,pages}/**/*.html`] : []),
    ],
    globIgnores: [
      `${distAppDir}**/_not-found.html`,
      `${distPagesDir}404.html`,
      `${distPagesDir}500.html`,
      ...(cliOptions.globIgnores ?? []),
      rebasePath({ baseDirectory: globDirectory, file: cliOptions.swSrc }),
      rebasePath({ baseDirectory: globDirectory, file: cliOptions.swDest }),
      rebasePath({ baseDirectory: globDirectory, file: `${cliOptions.swDest}.map` }),
    ],
    manifestTransforms: [
      ...(cliOptions.manifestTransforms ?? []),
      (manifestEntries) => {
        const manifest = manifestEntries.map((m) => {
          if (m.url.startsWith(distAppDir)) {
            // Keep the prefixing slash.
            m.url = m.url.slice(distAppDir.length - 1);
          }
          if (m.url.startsWith(distPagesDir)) {
            // Keep the prefixing slash.
            m.url = m.url.slice(distPagesDir.length - 1);
          }
          if (m.url.endsWith(".html")) {
            // trailingSlash: true && output: 'export'
            // or root index.html.
            // https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash
            // "/abc/index.html" -> "/abc/"
            // "/index.html" -> "/"
            if (m.url.endsWith("/index.html")) {
              m.url = m.url.slice(0, m.url.lastIndexOf("/") + 1);
            }
            // "/xxx.html" -> "/xxx"
            else {
              m.url = m.url.substring(0, m.url.lastIndexOf("."));
            }
            m.url = path.posix.join(basePath, m.url);
          }
          // Replace all references to "$(distDir)" with "$(assetPrefix)/_next/".
          if (m.url.startsWith(distDir)) {
            m.url = `${config.assetPrefix ?? ""}/_next/${m.url.slice(distDir.length)}`;
          }
          // Replace all references to public/ with "$(basePath)/".
          if (m.url.startsWith("public/")) {
            m.url = path.posix.join(basePath, m.url.slice(7));
          }
          return m;
        });
        return { manifest, warnings: [] };
      },
    ],
  };
};

export { generateGlobPatterns };

export type { SerwistOptions };
