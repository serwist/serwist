/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { FileDetails, ManifestEntry } from "@serwist/build";
import { transformManifest } from "@serwist/build";
import type { Asset, Chunk, Compilation, WebpackError } from "webpack";

import { getAssetHash } from "./get-asset-hash.js";
import { resolveWebpackURL } from "./resolve-webpack-url.js";
import type { InjectManifestOptions, InjectManifestOptionsComplete } from "./types.js";

/**
 * For a given asset, checks whether at least one of the conditions matches.
 *
 * @param asset The webpack asset in question. This will be passed
 * to any functions that are listed as conditions.
 * @param compilation The webpack compilation. This will be passed
 * to any functions that are listed as conditions.
 * @param conditions
 * @returns Whether or not at least one condition matches.
 * @private
 */
const checkConditions = (
  asset: Asset,
  compilation: Compilation,

  conditions: Array<string | RegExp | ((arg0: any) => boolean)> = [],
): boolean => {
  for (const condition of conditions) {
    if (typeof condition === "function") {
      return condition({ asset, compilation });
      //return compilation !== null;
    }
    if (compilation.compiler.webpack.ModuleFilenameHelpers.matchPart(asset.name, condition)) {
      return true;
    }
  }

  // We'll only get here if none of the conditions applied.
  return false;
};

/**
 * Returns the names of all the assets in all the chunks in a chunk group,
 * if provided a chunk group name.
 * Otherwise, if provided a chunk name, return all the assets in that chunk.
 * Otherwise, if there isn't a chunk group or chunk with that name, return null.
 *
 * @param compilation
 * @param chunkOrGroup
 * @returns
 * @private
 */
const getNamesOfAssetsInChunkOrGroup = (compilation: Compilation, chunkOrGroup: string): string[] | null => {
  const chunkGroup = compilation.namedChunkGroups?.get(chunkOrGroup);
  if (chunkGroup) {
    const assetNames = [];
    for (const chunk of chunkGroup.chunks) {
      assetNames.push(...getNamesOfAssetsInChunk(chunk));
    }
    return assetNames;
  }
  const chunk = compilation.namedChunks?.get(chunkOrGroup);
  if (chunk) {
    return getNamesOfAssetsInChunk(chunk);
  }

  // If we get here, there's no chunkGroup or chunk with that name.
  return null;
};

/**
 * Returns the names of all the assets in a chunk.
 *
 * @param chunk
 * @returns
 * @private
 */
const getNamesOfAssetsInChunk = (chunk: Chunk): string[] => {
  const assetNames: string[] = [];

  assetNames.push(...chunk.files);

  // This only appears to be set in webpack v5.
  if (chunk.auxiliaryFiles) {
    assetNames.push(...chunk.auxiliaryFiles);
  }

  return assetNames;
};

/**
 * Filters the set of assets out, based on the configuration options provided:
 * - chunks and excludeChunks, for chunkName-based criteria.
 * - include and exclude, for more general criteria.
 *
 * @param compilation The webpack compilation.
 * @param config The validated configuration, obtained from the plugin.
 * @returns The assets that should be included in the manifest,
 * based on the criteria provided.
 * @private
 */
const filterAssets = (compilation: Compilation, config: InjectManifestOptions): Set<Asset> => {
  const filteredAssets = new Set<Asset>();
  const assets = compilation.getAssets();

  const allowedAssetNames = new Set<string>();
  // See https://github.com/GoogleChrome/workbox/issues/1287
  if (Array.isArray(config.chunks)) {
    for (const name of config.chunks) {
      // See https://github.com/GoogleChrome/workbox/issues/2717
      const assetsInChunkOrGroup = getNamesOfAssetsInChunkOrGroup(compilation, name);
      if (assetsInChunkOrGroup) {
        for (const assetName of assetsInChunkOrGroup) {
          allowedAssetNames.add(assetName);
        }
      } else {
        compilation.warnings.push(
          new Error(`The chunk '${name}' was provided in your Serwist chunks config, but was not found in the compilation.`) as WebpackError,
        );
      }
    }
  }

  const deniedAssetNames = new Set();
  if (Array.isArray(config.excludeChunks)) {
    for (const name of config.excludeChunks) {
      // See https://github.com/GoogleChrome/workbox/issues/2717
      const assetsInChunkOrGroup = getNamesOfAssetsInChunkOrGroup(compilation, name);
      if (assetsInChunkOrGroup) {
        for (const assetName of assetsInChunkOrGroup) {
          deniedAssetNames.add(assetName);
        }
      } // Don't warn if the chunk group isn't found.
    }
  }

  for (const asset of assets) {
    // chunk based filtering is funky because:
    // - Each asset might belong to one or more chunks.
    // - If *any* of those chunk names match our config.excludeChunks,
    //   then we skip that asset.
    // - If the config.chunks is defined *and* there's no match
    //   between at least one of the chunkNames and one entry, then
    //   we skip that assets as well.

    if (deniedAssetNames.has(asset.name)) {
      continue;
    }

    if (Array.isArray(config.chunks) && !allowedAssetNames.has(asset.name)) {
      continue;
    }

    // Next, check asset-level checks via includes/excludes:
    const isExcluded = checkConditions(asset, compilation, config.exclude);
    if (isExcluded) {
      continue;
    }

    // Treat an empty config.includes as an implicit inclusion.
    const isIncluded = !Array.isArray(config.include) || checkConditions(asset, compilation, config.include);
    if (!isIncluded) {
      continue;
    }

    // If we've gotten this far, then add the asset.
    filteredAssets.add(asset);
  }

  return filteredAssets;
};

export const getManifestEntriesFromCompilation = async (
  compilation: Compilation,
  config: InjectManifestOptionsComplete,
): Promise<{ size: number; sortedEntries: ManifestEntry[] | undefined }> => {
  const filteredAssets = filterAssets(compilation, config);

  const { publicPath } = compilation.options.output;

  const fileDetails = Array.from(filteredAssets).map((asset) => {
    return {
      file: resolveWebpackURL(publicPath as string, asset.name),
      hash: getAssetHash(asset),
      size: asset.source.size() || 0,
    } satisfies FileDetails;
  });

  const { manifestEntries, size, warnings } = await transformManifest({
    fileDetails,
    additionalPrecacheEntries: config.additionalPrecacheEntries,
    dontCacheBustURLsMatching: config.dontCacheBustURLsMatching,
    manifestTransforms: config.manifestTransforms,
    maximumFileSizeToCacheInBytes: config.maximumFileSizeToCacheInBytes,
    modifyURLPrefix: config.modifyURLPrefix,
    transformParam: compilation,
    disablePrecacheManifest: config.disablePrecacheManifest,
  });

  // See https://github.com/GoogleChrome/workbox/issues/2790
  for (const warning of warnings) {
    compilation.warnings.push(new Error(warning) as WebpackError);
  }

  // Ensure that the entries are properly sorted by URL.
  const sortedEntries = manifestEntries?.sort((a, b) => (a.url === b.url ? 0 : a.url > b.url ? 1 : -1));

  return { size, sortedEntries };
};
