/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { getSingletonPrecacheController } from "./singletonPrecacheController.js";

/**
 * Takes in a URL, and returns the corresponding URL that could be used to
 * lookup the entry in the precache.
 *
 * If a relative URL is provided, the location of the service worker file will
 * be used as the base.
 *
 * For precached entries without revision information, the cache key will be the
 * same as the original URL.
 *
 * For precached entries with revision information, the cache key will be the
 * original URL with the addition of a query parameter used for keeping track of
 * the revision info.
 *
 * @param url The URL whose cache key to look up.
 * @returns The cache key that corresponds to that URL.
 * @deprecated
 */
export const getCacheKeyForURL = (url: string): string | undefined => {
  const precacheController = getSingletonPrecacheController();
  return precacheController.getCacheKeyForURL(url);
};
