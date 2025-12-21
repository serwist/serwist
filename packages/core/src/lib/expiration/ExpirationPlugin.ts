/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import type { CacheDidUpdateCallbackParam, CachedResponseWillBeUsedCallbackParam, StrategyPlugin } from "#lib/types.js";
import type { Strategy } from "../strategies/legacy/Strategy.js";
import { type ExpirationPluginOptions, type ExpirationPlugin as ExpirationPluginStruct, expiration } from "./plugin.js";

/**
 * This plugin can be used in a {@linkcode Strategy} to regularly enforce a
 * limit on the age and/or the number of cached requests.
 *
 * It can only be used with {@linkcode Strategy} instances that have a custom `cacheName` property set.
 * In other words, it can't be used to expire entries in strategies that use the default runtime
 * cache name.
 *
 * Whenever a cached response is used or updated, this plugin will look
 * at the associated cache and remove any old or extra responses.
 *
 * When using `maxAgeSeconds`, responses may be used *once* after expiring
 * because the expiration clean up will not have occurred until *after* the
 * cached response has been used. If the response has a "Date" header, then a lightweight expiration
 * check is performed, and the response will not be used immediately.
 *
 * When using `maxEntries`, the least recently requested entry will be removed
 * from the cache.
 *
 * @see https://serwist.pages.dev/docs/serwist/runtime-caching/plugins/expiration-plugin
 */
export class ExpirationPlugin implements StrategyPlugin {
  private readonly instance: ExpirationPluginStruct;

  /**
   * @param config
   */
  constructor(config: ExpirationPluginOptions = {}) {
    this.instance = expiration(config);
  }

  /**
   * A lifecycle callback that will be triggered automatically when a
   * response is about to be returned from a [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache).
   * It allows the response to be inspected for freshness and
   * prevents it from being used if the response's `Date` header value is
   * older than the configured `maxAgeSeconds`.
   *
   * @param options
   * @returns `cachedResponse` if it is fresh and `null` if it is stale or
   * not available.
   * @private
   */
  cachedResponseWillBeUsed(param: CachedResponseWillBeUsedCallbackParam) {
    return this.instance.cachedResponseWillBeUsed?.(param);
  }

  /**
   * A lifecycle callback that will be triggered automatically when an entry is added
   * to a cache.
   *
   * @param options
   * @private
   */
  cacheDidUpdate(param: CacheDidUpdateCallbackParam) {
    return this.instance.cacheDidUpdate?.(param);
  }

  /**
   * Deletes the underlying `Cache` instance associated with this instance and the metadata
   * from IndexedDB used to keep track of expiration details for each `Cache` instance.
   *
   * When using cache expiration, calling this method is preferable to calling
   * `caches.delete()` directly, since this will ensure that the IndexedDB
   * metadata is also cleanly removed and that open IndexedDB instances are deleted.
   *
   * Note that if you're *not* using cache expiration for a given cache, calling
   * `caches.delete()` and passing in the cache's name should be sufficient.
   * There is no Serwist-specific method needed for cleanup in that case.
   */
  deleteCacheAndMetadata(): Promise<void> {
    return this.instance.deleteCacheAndMetadata();
  }
}
