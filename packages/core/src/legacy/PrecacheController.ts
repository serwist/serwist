/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { parallel } from "@serwist/utils";
import { PrecacheStrategy } from "../lib/strategies/PrecacheStrategy.js";
import type { Strategy } from "../lib/strategies/Strategy.js";
import type { RouteHandlerCallback, SerwistPlugin } from "../types.js";
import type { CleanupResult, InstallResult, PrecacheEntry } from "../types.js";
import { PrecacheInstallReportPlugin } from "../utils/PrecacheInstallReportPlugin.js";
import { SerwistError } from "../utils/SerwistError.js";
import { assert } from "../utils/assert.js";
import { cacheNames as privateCacheNames } from "../utils/cacheNames.js";
import { createCacheKey } from "../utils/createCacheKey.js";
import { logger } from "../utils/logger.js";
import { printCleanupDetails } from "../utils/printCleanupDetails.js";
import { printInstallDetails } from "../utils/printInstallDetails.js";
import { waitUntil } from "../utils/waitUntil.js";
import { PrecacheCacheKeyPlugin } from "./utils/PrecacheCacheKeyPlugin.js";

// Give TypeScript the correct global.
declare const self: ServiceWorkerGlobalScope;

interface PrecacheControllerOptions {
  /**
   * The cache to use for precaching.
   */
  cacheName?: string;
  /**
   * Plugins to use when precaching as well as responding to fetch
   * events for precached assets.
   */
  plugins?: SerwistPlugin[];
  /**
   * Whether to attempt to get the response from the network if there's
   * a precache miss.
   */
  fallbackToNetwork?: boolean;
  /**
   * The number of precache requests that should be made concurrently.
   *
   * @default 1
   */
  concurrentPrecaching?: number;
}

/**
 * Performs efficient precaching of assets.
 * @deprecated
 */
export class PrecacheController {
  private _installAndActiveListenersAdded?: boolean;
  private _concurrentPrecaching: number;
  private readonly _strategy: Strategy;
  private readonly _urlsToCacheKeys: Map<string, string> = new Map();
  private readonly _urlsToCacheModes: Map<string, "reload" | "default" | "no-store" | "no-cache" | "force-cache" | "only-if-cached"> = new Map();
  private readonly _cacheKeysToIntegrities: Map<string, string> = new Map();

  /**
   * Create a new PrecacheController.
   *
   * @param options
   */
  constructor({ cacheName, plugins = [], fallbackToNetwork = true, concurrentPrecaching = 1 }: PrecacheControllerOptions = {}) {
    this._concurrentPrecaching = concurrentPrecaching;
    this._strategy = new PrecacheStrategy({
      cacheName: privateCacheNames.getPrecacheName(cacheName),
      plugins: [...plugins, new PrecacheCacheKeyPlugin({ precacheController: this })],
      fallbackToNetwork,
    });
    // Bind the install and activate methods to the instance.
    this.install = this.install.bind(this);
    this.activate = this.activate.bind(this);
  }

  /**
   * The strategy created by this controller and
   * used to cache assets and respond to fetch events.
   */
  get strategy(): Strategy {
    return this._strategy;
  }

  /**
   * Adds items to the precache list, removing any duplicates and
   * stores the files in the precache cache when the service
   * worker installs.
   *
   * This method can be called multiple times.
   *
   * @param entries Array of entries to precache.
   */
  precache(entries: (PrecacheEntry | string)[]): void {
    this.addToCacheList(entries);

    if (!this._installAndActiveListenersAdded) {
      self.addEventListener("install", this.install);
      self.addEventListener("activate", this.activate);
      this._installAndActiveListenersAdded = true;
    }
  }

  /**
   * This method will add items to the precache list, removing duplicates
   * and ensuring the information is valid.
   *
   * @param entries Array of entries to precache.
   */
  addToCacheList(entries: (PrecacheEntry | string)[]): void {
    if (process.env.NODE_ENV !== "production") {
      assert!.isArray(entries, {
        moduleName: "serwist/legacy",
        className: "PrecacheController",
        funcName: "addToCacheList",
        paramName: "entries",
      });
    }

    const urlsToWarnAbout: string[] = [];
    for (const entry of entries) {
      // See https://github.com/GoogleChrome/workbox/issues/2259
      if (typeof entry === "string") {
        urlsToWarnAbout.push(entry);
      } else if (entry && !entry.integrity && entry.revision === undefined) {
        urlsToWarnAbout.push(entry.url);
      }

      const { cacheKey, url } = createCacheKey(entry);
      const cacheMode = typeof entry !== "string" && entry.revision ? "reload" : "default";

      if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) {
        throw new SerwistError("add-to-cache-list-conflicting-entries", {
          firstEntry: this._urlsToCacheKeys.get(url),
          secondEntry: cacheKey,
        });
      }

      if (typeof entry !== "string" && entry.integrity) {
        if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) {
          throw new SerwistError("add-to-cache-list-conflicting-integrities", {
            url,
          });
        }
        this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
      }

      this._urlsToCacheKeys.set(url, cacheKey);
      this._urlsToCacheModes.set(url, cacheMode);

      if (urlsToWarnAbout.length > 0) {
        const warningMessage = `Serwist is precaching URLs without revision info: ${urlsToWarnAbout.join(
          ", ",
        )}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        if (process.env.NODE_ENV === "production") {
          // Use console directly to display this warning without bloating
          // bundle sizes by pulling in all of the logger codebase in prod.
          console.warn(warningMessage);
        } else {
          logger.warn(warningMessage);
        }
      }
    }
  }

  /**
   * Precaches new and updated assets. Call this method from the service worker
   * install event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param event
   * @returns
   */
  install(event: ExtendableEvent): Promise<InstallResult> {
    return waitUntil<InstallResult>(event, async () => {
      const installReportPlugin = new PrecacheInstallReportPlugin();
      this.strategy.plugins.push(installReportPlugin);

      await parallel(this._concurrentPrecaching, Array.from(this._urlsToCacheKeys.entries()), async ([url, cacheKey]): Promise<void> => {
        const integrity = this._cacheKeysToIntegrities.get(cacheKey);
        const cacheMode = this._urlsToCacheModes.get(url);

        const request = new Request(url, {
          integrity,
          cache: cacheMode,
          credentials: "same-origin",
        });

        await Promise.all(
          this.strategy.handleAll({
            event,
            request,
            url: new URL(request.url),
            params: { cacheKey },
          }),
        );
      });

      const { updatedURLs, notUpdatedURLs } = installReportPlugin;

      if (process.env.NODE_ENV !== "production") {
        printInstallDetails(updatedURLs, notUpdatedURLs);
      }

      return { updatedURLs, notUpdatedURLs };
    });
  }

  /**
   * Deletes assets that are no longer present in the current precache manifest.
   * Call this method from the service worker activate event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param event
   * @returns
   */
  activate(event: ExtendableEvent): Promise<CleanupResult> {
    return waitUntil<CleanupResult>(event, async () => {
      const cache = await self.caches.open(this.strategy.cacheName);
      const currentlyCachedRequests = await cache.keys();
      const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());

      const deletedCacheRequests: string[] = [];

      for (const request of currentlyCachedRequests) {
        if (!expectedCacheKeys.has(request.url)) {
          await cache.delete(request);
          deletedCacheRequests.push(request.url);
        }
      }

      if (process.env.NODE_ENV !== "production") {
        printCleanupDetails(deletedCacheRequests);
      }

      return { deletedCacheRequests };
    });
  }

  /**
   * Returns a mapping of a precached URL to the corresponding cache key, taking
   * into account the revision information for the URL.
   *
   * @returns A URL to cache key mapping.
   */
  getURLsToCacheKeys(): Map<string, string> {
    return this._urlsToCacheKeys;
  }

  /**
   * Returns a list of all the URLs that have been precached by the current
   * service worker.
   *
   * @returns The precached URLs.
   */
  getCachedURLs(): string[] {
    return [...this._urlsToCacheKeys.keys()];
  }

  /**
   * Returns the cache key used for storing a given URL. If that URL is
   * unversioned, like `/index.html', then the cache key will be the original
   * URL with a search parameter appended to it.
   *
   * @param url A URL whose cache key you want to look up.
   * @returns The versioned URL that corresponds to a cache key
   * for the original URL, or undefined if that URL isn't precached.
   */
  getCacheKeyForURL(url: string): string | undefined {
    const urlObject = new URL(url, location.href);
    return this._urlsToCacheKeys.get(urlObject.href);
  }

  /**
   * @param url A cache key whose SRI you want to look up.
   * @returns The subresource integrity associated with the cache key,
   * or undefined if it's not set.
   */
  getIntegrityForCacheKey(cacheKey: string): string | undefined {
    return this._cacheKeysToIntegrities.get(cacheKey);
  }

  /**
   * This acts as a drop-in replacement for
   * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
   * with the following differences:
   *
   * - It knows what the name of the precache is, and only checks in that cache.
   * - It allows you to pass in an "original" URL without versioning parameters,
   * and it will automatically look up the correct cache key for the currently
   * active revision of that URL.
   *
   * E.g., `matchPrecache('index.html')` will find the correct precached
   * response for the currently active service worker, even if the actual cache
   * key is `'/index.html?__WB_REVISION__=1234abcd'`.
   *
   * @param request The key (without revisioning parameters)
   * to look up in the precache.
   * @returns
   */
  async matchPrecache(request: string | Request): Promise<Response | undefined> {
    const url = request instanceof Request ? request.url : request;
    const cacheKey = this.getCacheKeyForURL(url);
    if (cacheKey) {
      const cache = await self.caches.open(this.strategy.cacheName);
      return cache.match(cacheKey);
    }
    return undefined;
  }

  /**
   * Returns a function that looks up `url` in the precache (taking into
   * account revision information), and returns the corresponding `Response`.
   *
   * @param url The precached URL which will be used to lookup the response.
   * @return
   */
  createHandlerBoundToURL(url: string): RouteHandlerCallback {
    const cacheKey = this.getCacheKeyForURL(url);
    if (!cacheKey) {
      throw new SerwistError("non-precached-url", { url });
    }
    return (options) => {
      options.request = new Request(url);
      options.params = { cacheKey, ...options.params };

      return this.strategy.handle(options);
    };
  }
}
