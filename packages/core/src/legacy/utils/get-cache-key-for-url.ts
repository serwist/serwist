/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { PrecacheRouteOptions } from "$lib/types.js";
import { generateURLVariations } from "../../utils/generate-url-variations.js";
import { getSingletonPrecacheController } from "../singleton-precache-controller.js";

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
