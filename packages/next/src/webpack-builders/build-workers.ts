import path from "node:path";

import type { TsConfigJson } from "type-fest";
import type { Configuration } from "webpack";
import type { ManifestEntry } from "@serwist/build";

import type { NextBuildInfo } from "../private-types.js";
import type { PluginOptions } from "../types.js";
import { buildCustomWorker } from "./build-custom-worker.js";
import { buildFallbackWorker } from "./build-fallback-worker.js";
import { getDefaultDocumentPage } from "./get-default-document-page.js";

export interface BuildWorkersOptions
  extends Required<
    Pick<
      PluginOptions,
      | "customWorkerSrc"
      | "customWorkerDest"
      | "customWorkerPrefix"
      | "fallbacks"
    >
  > {
  plugins: Configuration["plugins"];
  tsConfigJson: TsConfigJson | undefined;
}

interface BuildWorkersCompleteOptions
  extends BuildWorkersOptions,
    Pick<
      NextBuildInfo,
      | "rootDir"
      | "destDir"
      | "basePath"
      | "buildId"
      | "pageExtensions"
      | "isDev"
      | "isAppDirEnabled"
    > {}

export const buildWorkers = ({
  rootDir,
  destDir,
  basePath,
  buildId,
  pageExtensions,
  isDev,
  isAppDirEnabled,
  plugins,
  tsConfigJson,

  customWorkerSrc,
  customWorkerDest,
  customWorkerPrefix,
  fallbacks,
}: BuildWorkersCompleteOptions) => {
  const importScripts: string[] = [];
  const additionalManifestEntries: ManifestEntry[] = [];

  const cwDest = path.join(rootDir, customWorkerDest);

  const customWorkerScriptName = buildCustomWorker({
    isDev,
    baseDir: rootDir,
    swDest: destDir,
    customWorkerSrc,
    customWorkerDest: cwDest,
    customWorkerPrefix,
    plugins,
    tsconfig: tsConfigJson,
    basePath,
  });

  if (!!customWorkerScriptName) {
    importScripts.unshift(customWorkerScriptName);
  }

  let hasFallbacks = false;

  if (fallbacks) {
    if (!fallbacks.document) {
      fallbacks.document = getDefaultDocumentPage(
        rootDir,
        pageExtensions,
        isAppDirEnabled
      );
    }
    const fallbackWorker = buildFallbackWorker({
      isDev,
      buildId,
      fallbacks,
      destDir,
      basePath,
    });

    if (fallbackWorker) {
      hasFallbacks = true;
      importScripts.unshift(fallbackWorker.name);

      fallbackWorker.precaches.forEach((route) => {
        if (
          route &&
          typeof route !== "boolean" &&
          !additionalManifestEntries.find(
            (entry) => typeof entry !== "string" && entry.url.startsWith(route)
          )
        ) {
          additionalManifestEntries.push({
            url: route,
            revision: buildId,
          });
        }
      });
    }
  }

  return { hasFallbacks, additionalManifestEntries };
};
