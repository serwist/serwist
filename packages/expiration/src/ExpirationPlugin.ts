/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { SerwistPlugin } from "@serwist/core";
import { registerQuotaErrorCallback } from "@serwist/core";
import { assert, dontWaitFor, getFriendlyURL, logger, privateCacheNames, SerwistError } from "@serwist/core/internal";

import { CacheExpiration } from "./CacheExpiration.js";

export interface ExpirationPluginOptions {
  /**
   * The maximum number of entries to cache. Entries used the least will be removed
   * as the maximum is reached.
   */
  maxEntries?: number;
  /**
   * The maximum age of an entry before it's treated as stale and removed.
   */
  maxAgeSeconds?: number;
  /**
   * The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
   * that will be used when calling `delete()` on the cache.
   */
  matchOptions?: CacheQueryOptions;
  /**
   * Whether to opt this cache in to automatic deletion if the available storage quota has been exceeded.
   */
  purgeOnQuotaError?: boolean;
}

/**
 * This plugin can be used in a `@serwist/strategies` Strategy to regularly enforce a
 * limit on the age and / or the number of cached requests.
 *
 * It can only be used with Strategy instances that have a
 * [custom `cacheName` property set](/web/tools/workbox/guides/configure-workbox#custom_cache_names_in_strategies).
 * In other words, it can't be used to expire entries in strategy that uses the
 * default runtime cache name.
 *
 * Whenever a cached response is used or updated, this plugin will look
 * at the associated cache and remove any old or extra responses.
 *
 * When using `maxAgeSeconds`, responses may be used *once* after expiring
 * because the expiration clean up will not have occurred until *after* the
 * cached response has been used. If the response has a "Date" header, then
 * a light weight expiration check is performed and the response will not be
 * used immediately.
 *
 * When using `maxEntries`, the entry least-recently requested will be removed
 * from the cache first.
 */
class ExpirationPlugin implements SerwistPlugin {
  private readonly _config: ExpirationPluginOptions;
  private readonly _maxAgeSeconds?: number;
  private _cacheExpirations: Map<string, CacheExpiration>;

  /**
   * @param config
   */
  constructor(config: ExpirationPluginOptions = {}) {
    if (process.env.NODE_ENV !== "production") {
      if (!(config.maxEntries || config.maxAgeSeconds)) {
        throw new SerwistError("max-entries-or-age-required", {
          moduleName: "@serwist/expiration",
          className: "Plugin",
          funcName: "constructor",
        });
      }

      if (config.maxEntries) {
        assert!.isType(config.maxEntries, "number", {
          moduleName: "@serwist/expiration",
          className: "Plugin",
          funcName: "constructor",
          paramName: "config.maxEntries",
        });
      }

      if (config.maxAgeSeconds) {
        assert!.isType(config.maxAgeSeconds, "number", {
          moduleName: "@serwist/expiration",
          className: "Plugin",
          funcName: "constructor",
          paramName: "config.maxAgeSeconds",
        });
      }
    }

    this._config = config;
    this._maxAgeSeconds = config.maxAgeSeconds;
    this._cacheExpirations = new Map();

    if (config.purgeOnQuotaError) {
      registerQuotaErrorCallback(() => this.deleteCacheAndMetadata());
    }
  }

  /**
   * A simple helper method to return a CacheExpiration instance for a given
   * cache name.
   *
   * @param cacheName
   * @returns
   * @private
   */
  private _getCacheExpiration(cacheName: string): CacheExpiration {
    if (cacheName === privateCacheNames.getRuntimeName()) {
      throw new SerwistError("expire-custom-caches-only");
    }

    let cacheExpiration = this._cacheExpirations.get(cacheName);
    if (!cacheExpiration) {
      cacheExpiration = new CacheExpiration(cacheName, this._config);
      this._cacheExpirations.set(cacheName, cacheExpiration);
    }
    return cacheExpiration;
  }

  /**
   * A "lifecycle" callback that will be triggered automatically by the
   * `@serwist/strategies` handlers when a `Response` is about to be returned
   * from a [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to
   * the handler. It allows the `Response` to be inspected for freshness and
   * prevents it from being used if the `Response`'s `Date` header value is
   * older than the configured `maxAgeSeconds`.
   *
   * @param options
   * @returns Either the `cachedResponse`, if it's fresh, or `null` if the `Response`
   * is older than `maxAgeSeconds`.
   * @private
   */
  cachedResponseWillBeUsed: SerwistPlugin["cachedResponseWillBeUsed"] = async ({ event, request, cacheName, cachedResponse }) => {
    if (!cachedResponse) {
      return null;
    }

    const isFresh = this._isResponseDateFresh(cachedResponse);

    // Expire entries to ensure that even if the expiration date has
    // expired, it'll only be used once.
    const cacheExpiration = this._getCacheExpiration(cacheName);
    dontWaitFor(cacheExpiration.expireEntries());

    // Update the metadata for the request URL to the current timestamp,
    // but don't `await` it as we don't want to block the response.
    const updateTimestampDone = cacheExpiration.updateTimestamp(request.url);
    if (event) {
      try {
        event.waitUntil(updateTimestampDone);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          // The event may not be a fetch event; only log the URL if it is.
          if ("request" in event) {
            logger.warn(
              `Unable to ensure service worker stays alive when ` +
                `updating cache entry for ` +
                `'${getFriendlyURL((event as FetchEvent).request.url)}'.`
            );
          }
        }
      }
    }

    return isFresh ? cachedResponse : null;
  };

  /**
   * @param cachedResponse
   * @returns
   * @private
   */
  private _isResponseDateFresh(cachedResponse: Response): boolean {
    if (!this._maxAgeSeconds) {
      // We aren't expiring by age, so return true, it's fresh
      return true;
    }

    // Check if the 'date' header will suffice a quick expiration check.
    // See https://github.com/GoogleChromeLabs/sw-toolbox/issues/164 for
    // discussion.
    const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
    if (dateHeaderTimestamp === null) {
      // Unable to parse date, so assume it's fresh.
      return true;
    }

    // If we have a valid headerTime, then our response is fresh iff the
    // headerTime plus maxAgeSeconds is greater than the current time.
    const now = Date.now();
    return dateHeaderTimestamp >= now - this._maxAgeSeconds * 1000;
  }

  /**
   * This method will extract the data header and parse it into a useful
   * value.
   *
   * @param cachedResponse
   * @returns
   * @private
   */
  private _getDateHeaderTimestamp(cachedResponse: Response): number | null {
    if (!cachedResponse.headers.has("date")) {
      return null;
    }

    const dateHeader = cachedResponse.headers.get("date");
    const parsedDate = new Date(dateHeader!);
    const headerTime = parsedDate.getTime();

    // If the Date header was invalid for some reason, parsedDate.getTime()
    // will return NaN.
    if (isNaN(headerTime)) {
      return null;
    }

    return headerTime;
  }

  /**
   * A "lifecycle" callback that will be triggered automatically by the
   * `@serwist/strategies` handlers when an entry is added to a cache.
   *
   * @param options
   * @private
   */
  cacheDidUpdate: SerwistPlugin["cacheDidUpdate"] = async ({ cacheName, request }) => {
    if (process.env.NODE_ENV !== "production") {
      assert!.isType(cacheName, "string", {
        moduleName: "@serwist/expiration",
        className: "Plugin",
        funcName: "cacheDidUpdate",
        paramName: "cacheName",
      });
      assert!.isInstance(request, Request, {
        moduleName: "@serwist/expiration",
        className: "Plugin",
        funcName: "cacheDidUpdate",
        paramName: "request",
      });
    }

    const cacheExpiration = this._getCacheExpiration(cacheName);
    await cacheExpiration.updateTimestamp(request.url);
    await cacheExpiration.expireEntries();
  };

  /**
   * This is a helper method that performs two operations:
   *
   * - Deletes *all* the underlying Cache instances associated with this plugin
   * instance, by calling caches.delete() on your behalf.
   * - Deletes the metadata from IndexedDB used to keep track of expiration
   * details for each Cache instance.
   *
   * When using cache expiration, calling this method is preferable to calling
   * `caches.delete()` directly, since this will ensure that the IndexedDB
   * metadata is also cleanly removed and open IndexedDB instances are deleted.
   *
   * Note that if you're *not* using cache expiration for a given cache, calling
   * `caches.delete()` and passing in the cache's name should be sufficient.
   * There is no Serwist-specific method needed for cleanup in that case.
   */
  async deleteCacheAndMetadata(): Promise<void> {
    // Do this one at a time instead of all at once via `Promise.all()` to
    // reduce the chance of inconsistency if a promise rejects.
    for (const [cacheName, cacheExpiration] of this._cacheExpirations) {
      await self.caches.delete(cacheName);
      await cacheExpiration.delete();
    }

    // Reset this._cacheExpirations to its initial state.
    this._cacheExpirations = new Map();
  }
}

export { ExpirationPlugin };
