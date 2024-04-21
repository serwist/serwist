/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { SerwistError } from "./SerwistError.js";

import type { PrecacheEntry } from "../types.js";

interface CacheKey {
  cacheKey: string;
  url: string;
}

// Name of the search parameter used to store revision info.
const REVISION_SEARCH_PARAM = "__WB_REVISION__";

/**
 * Converts a manifest entry into a versioned URL suitable for precaching.
 *
 * @param entry
 * @returns A URL with versioning info.
 *
 * @private
 */
export const createCacheKey = (entry: PrecacheEntry | string): CacheKey => {
  if (!entry) {
    throw new SerwistError("add-to-cache-list-unexpected-type", { entry });
  }

  // If a precache manifest entry is a string, it's assumed to be a versioned
  // URL, like '/app.abcd1234.js'. Return as-is.
  if (typeof entry === "string") {
    const urlObject = new URL(entry, location.href);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href,
    };
  }

  const { revision, url } = entry;
  if (!url) {
    throw new SerwistError("add-to-cache-list-unexpected-type", { entry });
  }

  // If there's just a URL and no revision, then it's also assumed to be a
  // versioned URL.
  if (!revision) {
    const urlObject = new URL(url, location.href);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href,
    };
  }

  // Otherwise, construct a properly versioned URL using the custom Serwist
  // search parameter along with the revision info.
  const cacheKeyURL = new URL(url, location.href);
  const originalURL = new URL(url, location.href);
  cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
  return {
    cacheKey: cacheKeyURL.href,
    url: originalURL.href,
  };
};
