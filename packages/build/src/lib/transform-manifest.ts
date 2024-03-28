/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { BaseResolved, FileDetails, ManifestEntry, ManifestTransform } from "../types.js";
import { additionalPrecacheEntriesTransform } from "./additional-precache-entries-transform.js";
import { errors } from "./errors.js";
import { maximumSizeTransform } from "./maximum-size-transform.js";
import { modifyURLPrefixTransform } from "./modify-url-prefix-transform.js";
import { noRevisionForURLsMatchingTransform } from "./no-revision-for-urls-matching-transform.js";

/**
 * A `ManifestTransform` function can be used to modify the modify the `url` or
 * `revision` properties of some or all of the
 * `@serwist/build.ManifestEntry` in the manifest.
 *
 * Deleting the `revision` property of an entry will cause
 * the corresponding `url` to be precached without cache-busting parameters
 * applied, which is to say, it implies that the URL itself contains
 * proper versioning info. If the `revision` property is present, it must be
 * set to a string.
 *
 * @example A transformation that prepended the origin of a CDN for any
 * URL starting with '/assets/' could be implemented as:
 *
 * const cdnTransform = async (manifestEntries) => {
 *   const manifest = manifestEntries.map(entry => {
 *     const cdnOrigin = 'https://example.com';
 *     if (entry.url.startsWith('/assets/')) {
 *       entry.url = cdnOrigin + entry.url;
 *     }
 *     return entry;
 *   });
 *   return {manifest, warnings: []};
 * };
 *
 * @example A transformation that nulls the revision field when the
 * URL contains an 8-character hash surrounded by '.', indicating that it
 * already contains revision information:
 *
 * const removeRevisionTransform = async (manifestEntries) => {
 *   const manifest = manifestEntries.map(entry => {
 *     const hashRegExp = /\.\w{8}\./;
 *     if (entry.url.match(hashRegExp)) {
 *       entry.revision = null;
 *     }
 *     return entry;
 *   });
 *   return {manifest, warnings: []};
 * };
 *
 * @callback ManifestTransform
 * @param manifestEntries The full
 * array of entries, prior to the current transformation.
 * @param compilation When used in the webpack plugins, this param
 * will be set to the current `compilation`.
 * @returns The array of entries with the transformation applied,
 * and optionally, any warnings that should be reported back to the build tool.
 */

interface ManifestTransformResultWithWarnings {
  count: number;
  size: number;
  manifestEntries: ManifestEntry[] | undefined;
  warnings: string[];
}
interface ManifestEntryWithSize extends ManifestEntry {
  size: number;
}
interface TransformManifestOptions
  extends Pick<
    BaseResolved,
    | "additionalPrecacheEntries"
    | "dontCacheBustURLsMatching"
    | "manifestTransforms"
    | "maximumFileSizeToCacheInBytes"
    | "modifyURLPrefix"
    | "disablePrecacheManifest"
  > {
  fileDetails: FileDetails[];
  // When this is called by the webpack plugin, transformParam will be the
  // current webpack compilation.
  transformParam?: unknown;
}

export async function transformManifest({
  additionalPrecacheEntries,
  dontCacheBustURLsMatching,
  fileDetails,
  manifestTransforms,
  maximumFileSizeToCacheInBytes,
  modifyURLPrefix,
  transformParam,
  disablePrecacheManifest,
}: TransformManifestOptions): Promise<ManifestTransformResultWithWarnings> {
  if (disablePrecacheManifest) {
    return {
      count: 0,
      size: 0,
      manifestEntries: undefined,
      warnings: [],
    };
  }

  const allWarnings: string[] = [];

  // Take the array of fileDetail objects and convert it into an array of
  // {url, revision, size} objects, with \ replaced with /.
  const normalizedManifest: ManifestEntryWithSize[] = fileDetails.map((fileDetails) => ({
    url: fileDetails.file.replace(/\\/g, "/"),
    revision: fileDetails.hash,
    size: fileDetails.size,
  }));

  const transformsToApply: ManifestTransform[] = [];

  if (maximumFileSizeToCacheInBytes) {
    transformsToApply.push(maximumSizeTransform(maximumFileSizeToCacheInBytes));
  }

  if (modifyURLPrefix) {
    transformsToApply.push(modifyURLPrefixTransform(modifyURLPrefix));
  }

  if (dontCacheBustURLsMatching) {
    transformsToApply.push(noRevisionForURLsMatchingTransform(dontCacheBustURLsMatching));
  }

  // Run any manifestTransforms functions second-to-last.
  if (manifestTransforms) {
    transformsToApply.push(...manifestTransforms);
  }

  // Run additionalPrecacheEntriesTransform last.
  if (additionalPrecacheEntries) {
    transformsToApply.push(additionalPrecacheEntriesTransform(additionalPrecacheEntries));
  }

  let transformedManifest: ManifestEntryWithSize[] = normalizedManifest;
  for (const transform of transformsToApply) {
    const result = await transform(transformedManifest, transformParam);
    if (!("manifest" in result)) {
      throw new Error(errors["bad-manifest-transforms-return-value"]);
    }

    transformedManifest = result.manifest;
    allWarnings.push(...(result.warnings || []));
  }

  // Generate some metadata about the manifest before we clear out the size
  // properties from each entry.
  const count = transformedManifest.length;
  let size = 0;
  for (const manifestEntry of transformedManifest as (ManifestEntry & { size?: number })[]) {
    size += manifestEntry.size || 0;
    // biome-ignore lint/performance/noDelete: These values are no longer necessary.
    delete manifestEntry.size;
  }

  return {
    count,
    size,
    manifestEntries: transformedManifest as ManifestEntry[],
    warnings: allWarnings,
  };
}
