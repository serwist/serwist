import fs from "node:fs";
import path from "node:path";

import { findFirstTruthy } from "$utils/index.js";

export const getDefaultDocumentPage = (
  baseDir: string,
  pageExtensions: string[],
  isAppDirEnabled: boolean
) => {
  const pagesDir = findFirstTruthy(["pages", "src/pages"], (dir) => {
    dir = path.join(baseDir, dir);
    return fs.existsSync(dir) ? dir : undefined;
  });
  let appDir: string | undefined = undefined;

  if (isAppDirEnabled) {
    appDir = findFirstTruthy(["app", "src/app"], (dir) => {
      dir = path.join(baseDir, dir);
      return fs.existsSync(dir) ? dir : undefined;
    });
  }

  if (!pagesDir && !appDir) {
    return undefined;
  }

  for (const ext of pageExtensions) {
    if (appDir) {
      const appDirOffline = path.join(appDir, `~offline/page.${ext}`);
      if (fs.existsSync(appDirOffline)) {
        return "/~offline";
      }
    }
    if (pagesDir) {
      const pagesDirOffline = path.join(pagesDir, `_offline.${ext}`);
      if (pagesDirOffline && fs.existsSync(pagesDirOffline)) {
        return "/_offline";
      }
    }
  }

  return undefined;
};
