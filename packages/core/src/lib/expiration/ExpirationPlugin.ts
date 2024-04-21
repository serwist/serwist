/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { registerQuotaErrorCallback } from "../../registerQuotaErrorCallback.js";
import type { CacheDidUpdateCallbackParam, CachedResponseWillBeUsedCallbackParam, SerwistPlugin } from "../../types.js";
import { SerwistError } from "../../utils/SerwistError.js";
import { assert } from "../../utils/assert.js";
import { cacheNames as privateCacheNames } from "../../utils/cacheNames.js";
import { getFriendlyURL } from "../../utils/getFriendlyURL.js";
import { logger } from "../../utils/logger.js";
import { CacheExpiration } from "./CacheExpiration.js";

export interface ExpirationPluginOptions {
  /**
   * The maximum number of entries to cache. Entries used the least will be removed
   * as the maximum is reached.
   */
  maxEntries?: number;
  /**
   * The maximum number of seconds before an entry is treated as stale and removed.
   */
  maxAgeSeconds?: number;
  /**
   * Determines whether `maxAgeSeconds` should be calculated from when an
   * entry was last fetched or when it was last used.
   *
   * @default "last-fetched"
   */
  maxAgeFrom?: "last-fetched" | "last-used";
  /**
   * The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
   * that will be used when calling `delete()` on the cache.
   */
  matchOptions?: CacheQueryOptions;
  /**
   * Whether to opt this cache into automatic deletion if the available storage quota has been exceeded.
   */
  purgeOnQuotaError?: boolean;
}

/**
 * This plugin can be used in a `serwist/strategies` Strategy to regularly enforce a
 * limit on the age and/or the number of cached requests.
 *
 * It can only be used with Strategy instances that have a custom `cacheName` property set.
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
export class ExpirationPlugin implements SerwistPlugin {
  private readonly _config: ExpirationPluginOptions;
  private _cacheExpirations: Map<string, CacheExpiration>;

  /**
   * @param config
   */
  constructor(config: ExpirationPluginOptions = {}) {
    if (process.env.NODE_ENV !== "production") {
      if (!(config.maxEntries || config.maxAgeSeconds)) {
        throw new SerwistError("max-entries-or-age-required", {
          moduleName: "serwist",
          className: "ExpirationPlugin",
          funcName: "constructor",
        });
      }

      if (config.maxEntries) {
        assert!.isType(config.maxEntries, "number", {
          moduleName: "serwist",
          className: "ExpirationPlugin",
          funcName: "constructor",
          paramName: "config.maxEntries",
        });
      }

      if (config.maxAgeSeconds) {
        assert!.isType(config.maxAgeSeconds, "number", {
          moduleName: "serwist",
          className: "ExpirationPlugin",
          funcName: "constructor",
          paramName: "config.maxAgeSeconds",
        });
      }

      if (config.maxAgeFrom) {
        assert!.isType(config.maxAgeFrom, "string", {
          moduleName: "serwist",
          className: "ExpirationPlugin",
          funcName: "constructor",
          paramName: "config.maxAgeFrom",
        });
      }
    }

    this._config = config;
    this._cacheExpirations = new Map();

    if (!this._config.maxAgeFrom) {
      this._config.maxAgeFrom = "last-fetched";
    }

    if (this._config.purgeOnQuotaError) {
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
   * `serwist/strategies` handlers when a `Response` is about to be returned
   * from a [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to
   * the handler. It allows the `Response` to be inspected for freshness and
   * prevents it from being used if the `Response`'s `Date` header value is
   * older than the configured `maxAgeSeconds`.
   *
   * @param options
   * @returns `cachedResponse` if it is fresh and `null` if it is stale or
   * not available.
   * @private
   */
  cachedResponseWillBeUsed({ event, cacheName, request, cachedResponse }: CachedResponseWillBeUsedCallbackParam) {
    if (!cachedResponse) {
      return null;
    }

    const isFresh = this._isResponseDateFresh(cachedResponse);

    // Expire entries to ensure that even if the expiration date has
    // expired, it'll only be used once.
    const cacheExpiration = this._getCacheExpiration(cacheName);

    const isMaxAgeFromLastUsed = this._config.maxAgeFrom === "last-used";

    const done = (async () => {
      // Update the metadata for the request URL to the current timestamp.
      // Only applies if `maxAgeFrom` is `"last-used"`, since the current
      // lifecycle callback is `cachedResponseWillBeUsed`.
      // This needs to be called before `expireEntries()` so as to avoid
      // this URL being marked as expired.
      if (isMaxAgeFromLastUsed) {
        await cacheExpiration.updateTimestamp(request.url);
      }
      await cacheExpiration.expireEntries();
    })();
    try {
      event.waitUntil(done);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        if (event instanceof FetchEvent) {
          logger.warn(`Unable to ensure service worker stays alive when updating cache entry for '${getFriendlyURL(event.request.url)}'.`);
        }
      }
    }

    return isFresh ? cachedResponse : null;
  }

  /**
   * @param cachedResponse
   * @returns
   * @private
   */
  private _isResponseDateFresh(cachedResponse: Response): boolean {
    const isMaxAgeFromLastUsed = this._config.maxAgeFrom === "last-used";
    // If `maxAgeFrom` is `"last-used"`, the `Date` header doesn't really
    // matter since it is about when the response was created.
    if (isMaxAgeFromLastUsed) {
      return true;
    }
    const now = Date.now();
    if (!this._config.maxAgeSeconds) {
      return true;
    }
    // Check if the `Date` header will suffice a quick expiration check.
    // See https://github.com/GoogleChromeLabs/sw-toolbox/issues/164 for
    // discussion.
    const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
    if (dateHeaderTimestamp === null) {
      // Unable to parse date, so assume it's fresh.
      return true;
    }
    // If we have a valid headerTime, then our response is fresh if the
    // headerTime plus maxAgeSeconds is greater than the current time.
    return dateHeaderTimestamp >= now - this._config.maxAgeSeconds * 1000;
  }

  /**
   * Extracts the `Date` header and parse it into an useful value.
   *
   * @param cachedResponse
   * @returns
   * @private
   */
  private _getDateHeaderTimestamp(cachedResponse: Response): number | null {
    if (!cachedResponse.headers.has("date")) {
      return null;
    }

    const dateHeader = cachedResponse.headers.get("date")!;
    const parsedDate = new Date(dateHeader);
    const headerTime = parsedDate.getTime();

    // If the `Date` header is invalid for some reason, `parsedDate.getTime()`
    // will return NaN.
    if (Number.isNaN(headerTime)) {
      return null;
    }

    return headerTime;
  }

  /**
   * A "lifecycle" callback that will be triggered automatically by the
   * `serwist/strategies` handlers when an entry is added to a cache.
   *
   * @param options
   * @private
   */
  async cacheDidUpdate({ cacheName, request }: CacheDidUpdateCallbackParam) {
    if (process.env.NODE_ENV !== "production") {
      assert!.isType(cacheName, "string", {
        moduleName: "serwist",
        className: "Plugin",
        funcName: "cacheDidUpdate",
        paramName: "cacheName",
      });
      assert!.isInstance(request, Request, {
        moduleName: "serwist",
        className: "Plugin",
        funcName: "cacheDidUpdate",
        paramName: "request",
      });
    }

    const cacheExpiration = this._getCacheExpiration(cacheName);
    await cacheExpiration.updateTimestamp(request.url);
    await cacheExpiration.expireEntries();
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
