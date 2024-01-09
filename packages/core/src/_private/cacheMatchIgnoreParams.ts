/*
  Copyright 2020 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

function stripParams(fullURL: string, ignoreParams: string[]) {
  const strippedURL = new URL(fullURL);
  for (const param of ignoreParams) {
    strippedURL.searchParams.delete(param);
  }
  return strippedURL.href;
}

/**
 * Matches an item in the cache, ignoring specific URL params. This is similar
 * to the `ignoreSearch` option, but it allows you to ignore just specific
 * params (while continuing to match on the others).
 *
 * @private
 * @param cache
 * @param request
 * @param matchOptions
 * @param ignoreParams
 * @returns
 */
async function cacheMatchIgnoreParams(
  cache: Cache,
  request: Request,
  ignoreParams: string[],
  matchOptions?: CacheQueryOptions,
): Promise<Response | undefined> {
  const strippedRequestURL = stripParams(request.url, ignoreParams);

  // If the request doesn't include any ignored params, match as normal.
  if (request.url === strippedRequestURL) {
    return cache.match(request, matchOptions);
  }

  // Otherwise, match by comparing keys
  const keysOptions = { ...matchOptions, ignoreSearch: true };
  const cacheKeys = await cache.keys(request, keysOptions);

  for (const cacheKey of cacheKeys) {
    const strippedCacheKeyURL = stripParams(cacheKey.url, ignoreParams);
    if (strippedRequestURL === strippedCacheKeyURL) {
      return cache.match(cacheKey, matchOptions);
    }
  }
  return;
}

export { cacheMatchIgnoreParams };
