/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { PrecacheRouteOptions } from "../../types.js";
import { generateURLVariations } from "../../utils/generateURLVariations.js";
import { getSingletonPrecacheController } from "../singletonPrecacheController.js";

/**
 * This function will take the request URL and manipulate it based on the
 * configuration options.
 *
 * @param url
 * @param options
 * @returns Returns the URL in the cache that matches the request,
 * if possible.
 *
 * @private
 */
export const getCacheKeyForURL = (url: string, options: PrecacheRouteOptions): string | undefined => {
  const precacheController = getSingletonPrecacheController();

  const urlsToCacheKeys = precacheController.getURLsToCacheKeys();
  for (const possibleURL of generateURLVariations(url, options)) {
    const possibleCacheKey = urlsToCacheKeys.get(possibleURL);
    if (possibleCacheKey) {
      return possibleCacheKey;
    }
  }

  return undefined;
};
