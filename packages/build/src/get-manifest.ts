/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { getFileManifestEntries } from "./lib/get-file-manifest-entries.js";
import { validateGetManifestOptions } from "./lib/validate-options.js";
import type { GetManifestOptions, GetManifestResult } from "./types.js";

/**
 * This method returns a list of URLs to precache, referred to as a "precache
 * manifest", along with details about the number of entries and their size,
 * based on the options you provide.
 *
 * ```
 * // The following lists some common options; see the rest of the documentation
 * // for the full set of options and defaults.
 * const {count, manifestEntries, size, warnings} = await getManifest({
 *   dontCacheBustURLsMatching: [new RegExp('...')],
 *   globDirectory: '...',
 *   globPatterns: ['...', '...'],
 *   maximumFileSizeToCacheInBytes: ...,
 * });
 * ```
 */
export const getManifest = async (config: GetManifestOptions): Promise<GetManifestResult> => {
  const options = await validateGetManifestOptions(config);

  return await getFileManifestEntries(options);
};
