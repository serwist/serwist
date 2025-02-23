import { parallel } from "@serwist/utils";
import type { Strategy } from "../../lib/strategies/Strategy.js";
import type { Controller, RouteHandlerCallback, UrlManipulation } from "../../types.js";
import { assert } from "../../utils/assert.js";
import { createCacheKey } from "../../utils/createCacheKey.js";
import { logger } from "../../utils/logger.js";
import { PrecacheInstallReportPlugin } from "./PrecacheInstallReportPlugin.js";
import { SerwistError } from "../../utils/SerwistError.js";
import { printInstallDetails } from "../../utils/printInstallDetails.js";
import { printCleanupDetails } from "../../utils/printCleanupDetails.js";
import { PrecacheStrategy } from "./PrecacheStrategy.js";
import { privateCacheNames } from "../../index.internal.js";
import { PrecacheCacheKeyPlugin } from "./PrecacheCacheKeyPlugin.js";
import { PrecacheRoute } from "./PrecacheRoute.js";
import type { Serwist } from "../../Serwist.js";
import { NavigationRoute } from "../../NavigationRoute.js";
import type { PrecacheStrategyOptions } from "./PrecacheStrategy.js";
import { parsePrecacheOptions } from "./parsePrecacheOptions.js";

export interface PrecacheEntry {
  integrity?: string;
  url: string;
  revision?: string | null;
}

export interface PrecacheRouteOptions {
  /**
   * Tells Serwist to check the precache for an entry whose URL is the request URL appended
   * with the specified value. Only applies if the request URL ends with "/".
   *
   * @default "index.html"
   */
  directoryIndex?: string | null;
  /**
   * An array of `RegExp` objects matching search params that should be removed when looking
   * for a precache match.
   */
  ignoreURLParametersMatching?: RegExp[];
  /**
   * Tells Serwist to check the precache for an entry whose URL is the request URL appended
   * with ".html".
   *
   * @default true
   */
  cleanURLs?: boolean;
  /**
   * A function that should take a URL and return an array of alternative URLs that should
   * be checked for precache matches.
   */
  urlManipulation?: UrlManipulation;
}

export interface PrecacheControllerOptions {
  /**
   * The cache to use for precaching.
   */
  cacheName?: string;
  /**
   * Whether outdated caches should be removed.
   *
   * @default false
   */
  cleanupOutdatedCaches?: boolean;
  /**
   * The number of precache requests that should be made concurrently.
   *
   * @default 10
   */
  concurrency?: number;
  /**
   * An URL that should point to a HTML file with which navigation requests for URLs that aren't
   * precached will be fulfilled.
   */
  navigateFallback?: string;
  /**
   * URLs that should be allowed to use the `navigateFallback` handler.
   */
  navigateFallbackAllowlist?: RegExp[];
  /**
   * URLs that should not be allowed to use the `navigateFallback` handler. This takes precedence
   * over `navigateFallbackAllowlist`.
   */
  navigateFallbackDenylist?: RegExp[];
}

export interface PrecacheOptions extends PrecacheStrategyOptions, PrecacheRouteOptions, PrecacheControllerOptions {}

export class PrecacheController implements Controller {
  private readonly _urlsToCacheKeys: Map<string, string> = new Map();
  private readonly _urlsToCacheModes: Map<string, "reload" | "default" | "no-store" | "no-cache" | "force-cache" | "only-if-cached"> = new Map();
  private readonly _cacheKeysToIntegrities: Map<string, string> = new Map();
  private readonly _strategy: Strategy;
  private _options: PrecacheControllerOptions;
  private _routeOptions: PrecacheRouteOptions;
  /**
   * Create a new PrecacheController.
   *
   * @param options
   */
  constructor(entries: (PrecacheEntry | string)[], precacheOptions?: PrecacheOptions) {
    const { strategyOptions, routeOptions, controllerOptions } = parsePrecacheOptions(precacheOptions);

    if (!strategyOptions.plugins) strategyOptions.plugins = [];
    strategyOptions.cacheName = privateCacheNames.getPrecacheName(strategyOptions.cacheName);
    strategyOptions.plugins.push(new PrecacheCacheKeyPlugin({ precacheController: this }));

    if (controllerOptions.concurrency === undefined) controllerOptions.concurrency = 10;

    this.addToCacheList(entries);
    this._strategy = new PrecacheStrategy(strategyOptions);
    this._options = controllerOptions;
    this._routeOptions = routeOptions;
    // Bind the install and activate methods to the instance.
    this.install = this.install.bind(this);
    this.activate = this.activate.bind(this);
  }
  /**
   * The strategy created by this controller and
   * used to cache assets and respond to `fetch` events.
   */
  get strategy(): Strategy {
    return this._strategy;
  }
  /**
   * Adds items to the cache list, removing duplicates and ensuring the information is valid.
   *
   * @param entries Array of entries to precache.
   */
  addToCacheList(entries: (PrecacheEntry | string)[]): void {
    if (process.env.NODE_ENV !== "production") {
      assert!.isArray(entries, {
        moduleName: "serwist",
        className: "PrecacheController",
        funcName: "addEntries",
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
        )}\nThis is generally NOT safe, as you risk serving outdated assets.`;
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
  init(serwist: Serwist) {
    serwist.registerRoute(new PrecacheRoute(this, this._routeOptions));

    if (this._options.navigateFallback) {
      serwist.registerRoute(
        new NavigationRoute(this.createHandlerBoundToUrl(this._options.navigateFallback), {
          allowlist: this._options.navigateFallbackAllowlist,
          denylist: this._options.navigateFallbackDenylist,
        }),
      );
    }
  }
  async install(event: ExtendableEvent): Promise<void> {
    const installReportPlugin = new PrecacheInstallReportPlugin();
    this._strategy.plugins.push(installReportPlugin);
    await parallel(this._options.concurrency!, Array.from(this._urlsToCacheKeys.entries()), async ([url, cacheKey]): Promise<void> => {
      const integrity = this._cacheKeysToIntegrities.get(cacheKey);
      const cacheMode = this._urlsToCacheModes.get(url);

      const request = new Request(url, {
        integrity,
        cache: cacheMode,
        credentials: "same-origin",
      });

      await Promise.all(
        this._strategy.handleAll({
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
  }
  async activate(): Promise<void> {
    const cache = await self.caches.open(this._strategy.cacheName);
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
  }

  /**
   * Returns a mapping of a precached URL to the corresponding cache key, taking
   * into account the revision information for the URL.
   *
   * @returns A URL to cache key mapping.
   */
  getUrlsToPrecacheKeys(): Map<string, string> {
    return this._urlsToCacheKeys;
  }

  /**
   * Returns a list of all the URLs that have been precached by the current
   * service worker.
   *
   * @returns The precached URLs.
   */
  getPrecachedUrls(): string[] {
    return [...this._urlsToCacheKeys.keys()];
  }

  /**
   * Returns the cache key used for storing a given URL. If that URL is
   * unversioned, like "/index.html", then the cache key will be the original
   * URL with a search parameter appended to it.
   *
   * @param url A URL whose cache key you want to look up.
   * @returns The versioned URL that corresponds to a cache key
   * for the original URL, or undefined if that URL isn't precached.
   */
  getPrecacheKeyForUrl(url: string): string | undefined {
    const urlObject = new URL(url, location.href);
    return this._urlsToCacheKeys.get(urlObject.href);
  }

  /**
   * @param url A cache key whose SRI you want to look up.
   * @returns The subresource integrity associated with the cache key,
   * or undefined if it's not set.
   */
  getIntegrityForPrecacheKey(cacheKey: string): string | undefined {
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
    const cacheKey = this.getPrecacheKeyForUrl(url);
    if (cacheKey) {
      const cache = await self.caches.open(this._strategy.cacheName);
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
  createHandlerBoundToUrl(url: string): RouteHandlerCallback {
    const cacheKey = this.getPrecacheKeyForUrl(url);
    if (!cacheKey) {
      throw new SerwistError("non-precached-url", { url });
    }
    return (options) => {
      options.request = new Request(url);
      options.params = { cacheKey, ...options.params };

      return this._strategy.handle(options);
    };
  }
}
