import path from "node:path";

import type { InjectManifestOptions } from "@serwist/build";
import { InjectManifest } from "@serwist/webpack-plugin";

import { logger } from "$utils/index.js";

import type { NextBuildInfo } from "./private-types.js";
import { resolveWorkboxCommon, type ResolveWorkboxCommonOptions } from "./resolve-workbox-common.js";
import type { PluginOptions } from "./types.js";
import { overrideAfterCalledMethod } from "./utils.js";
import { type BuildWorkersOptions } from "./webpack-builders/build-workers.js";

type PluginCompleteOptions = Required<Pick<PluginOptions, "extendDefaultRuntimeCaching" | "dynamicStartUrl">>;

interface WorkboxPluginOptions extends PluginCompleteOptions, BuildWorkersOptions, ResolveWorkboxCommonOptions, NextBuildInfo {
  workboxOptions: InjectManifestOptions;
  importScripts: string[];
}

export const resolveWorkboxPlugin = ({
  workboxOptions,

  // Next.js build info
  rootDir,
  destDir,
  buildId,
  isDev,

  // `resolveWorkboxCommon` options
  sw,
  buildExcludes,
  manifestEntries,
  manifestTransforms,
  modifyURLPrefix,
  publicPath,
}: WorkboxPluginOptions) => {
  const swSrc = path.join(rootDir, workboxOptions.swSrc);
  logger.event(`Using InjectManifest with ${swSrc}`);
  const workboxCommon = resolveWorkboxCommon({
    destDir,
    sw,
    isDev,
    buildId,
    buildExcludes,
    manifestEntries,
    manifestTransforms,
    modifyURLPrefix,
    publicPath,
  });
  const workboxPlugin = new InjectManifest({
    ...workboxCommon,
    ...workboxOptions,
    swSrc,
  });
  if (isDev) {
    overrideAfterCalledMethod(workboxPlugin);
  }
  return workboxPlugin;
};
