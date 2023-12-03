import fs from "node:fs";
import path from "node:path";

import type { TsConfigJson as TSConfigJSON } from "type-fest";

import { findFirstTruthy } from "./find-first-truthy.js";

export const loadTSConfig = (baseDir: string, relativeTSConfigPath: string | undefined): TSConfigJSON | undefined => {
  try {
    // Find tsconfig.json file
    const tsConfigPath = findFirstTruthy([relativeTSConfigPath ?? "tsconfig.json", "jsconfig.json"], (filePath) => {
      const resolvedPath = path.join(baseDir, filePath);
      return fs.existsSync(resolvedPath) ? resolvedPath : undefined;
    });

    if (!tsConfigPath) {
      return undefined;
    }

    // Read tsconfig.json file
    const tsConfigFile = JSON.parse(fs.readFileSync(tsConfigPath, "utf-8"));

    return tsConfigFile;
  } catch {
    return undefined;
  }
};
