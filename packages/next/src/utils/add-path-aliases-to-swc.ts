import type { Options } from "@swc/core";

export const addPathAliasesToSWC = (
  config: Options,
  baseDir: string,
  paths: Record<string, string[]>
) => {
  if (!config.jsc) {
    config.jsc = {};
  }
  config.jsc.baseUrl = baseDir;
  config.jsc.paths = paths;
};
