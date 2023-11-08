/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import path from "node:path";

import fse from "fs-extra";
import upath from "upath";

import type { GenerateSWOptions, ManifestEntry } from "../types.js";
import { bundle } from "./bundle.js";
import { errors } from "./errors.js";
import { serializeSWTemplateOptions } from "./serialize-sw-template-options.js";

export async function writeSWUsingDefaultTemplate({
  mode,
  babelPresetEnvTargets,
  cacheId,
  cleanupOutdatedCaches = true,
  clientsClaim = true,
  directoryIndex,
  disableDevLogs = false,
  ignoreURLParametersMatching,
  importScripts,
  manifestEntries,
  navigateFallback,
  navigateFallbackDenylist = [],
  navigateFallbackAllowlist = [],
  navigationPreload = false,
  offlineGoogleAnalytics,
  runtimeCaching,
  skipWaiting = true,
  sourcemap,
  swDest,
}: GenerateSWOptions & {
  manifestEntries: Array<ManifestEntry>;
}): Promise<Array<string>> {
  const outputDir = upath.dirname(swDest);
  try {
    await fse.mkdirp(outputDir);
  } catch (error) {
    throw new Error(
      `${errors["unable-to-make-sw-directory"]}. ` +
        `'${error instanceof Error && error.message ? error.message : ""}'`
    );
  }

  try {
    const files = await bundle({
      babelPresetEnvTargets,
      mode,
      sourcemap,
      swDest,
      unbundledCode: path.join(__dirname, "../../templates/sw-template.ts"),
      replaceValues: serializeSWTemplateOptions({
        cacheId: cacheId ?? undefined,
        shouldCleanupOutdatedCaches: cleanupOutdatedCaches,
        shouldClientsClaim: clientsClaim,
        disableDevLogs,
        scriptsToImport: importScripts,
        shouldRunPrecacheAndRoute: Array.isArray(manifestEntries) && manifestEntries.length > 0,
        manifestEntries,
        navigateFallback: navigateFallback ?? undefined,
        navigateFallbackDenylist,
        navigateFallbackAllowlist,
        navigationPreload,
        offlineAnalyticsConfig: offlineGoogleAnalytics,
        runtimeCaching: runtimeCaching ?? [],
        shouldSkipWaiting: skipWaiting,
        precacheOptions: {
          directoryIndex: directoryIndex ?? undefined,
          ignoreURLParametersMatching,
        },
      }),
    });

    const filePaths: Array<string> = [];

    for (const file of files) {
      const filePath = upath.resolve(file.name);
      filePaths.push(filePath);
      await fse.writeFile(filePath, file.contents);
    }

    return filePaths;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "EISDIR") {
      // See https://github.com/GoogleChrome/workbox/issues/612
      throw new Error(errors["sw-write-failure-directory"]);
    }
    throw new Error(`${errors["sw-write-failure"]} '${err.message}'`);
  }
}
