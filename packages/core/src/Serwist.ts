import { parallel } from "@serwist/utils";
import { NavigationRoute } from "./NavigationRoute.js";
import { PrecacheRoute } from "./PrecacheRoute.js";
import type { Route } from "./Route.js";
import { type HTTPMethod, defaultMethod } from "./constants.js";
import { disableDevLogs as disableDevLogsImpl } from "./disableDevLogs.js";
import { type GoogleAnalyticsInitializeOptions, initializeGoogleAnalytics } from "./lib/googleAnalytics/initializeGoogleAnalytics.js";
import { type PrecacheFallbackEntry, PrecacheFallbackPlugin } from "./lib/precaching/PrecacheFallbackPlugin.js";
import { PrecacheStrategy } from "./lib/strategies/PrecacheStrategy.js";
import { Strategy } from "./lib/strategies/Strategy.js";
import { enableNavigationPreload } from "./navigationPreload.js";
import { setCacheNameDetails } from "./setCacheNameDetails.js";
import type {
  RouteHandler,
  RouteHandlerCallback,
  RouteHandlerCallbackOptions,
  RouteHandlerObject,
  RouteMatchCallback,
  RouteMatchCallbackOptions,
  SerwistPlugin,
} from "./types.js";
import type { PrecacheRouteOptions, RuntimeCaching } from "./types.js";
import type { CleanupResult, InstallResult, PrecacheEntry } from "./types.js";
import { PrecacheCacheKeyPlugin } from "./utils/PrecacheCacheKeyPlugin.js";
import { PrecacheInstallReportPlugin } from "./utils/PrecacheInstallReportPlugin.js";
import { SerwistError } from "./utils/SerwistError.js";
import { assert } from "./utils/assert.js";
import { cacheNames as privateCacheNames } from "./utils/cacheNames.js";
import { cleanupOutdatedCaches as cleanupOutdatedCachesImpl } from "./utils/cleanupOutdatedCaches.js";
import { clientsClaim as clientsClaimImpl } from "./utils/clientsClaim.js";
import { createCacheKey } from "./utils/createCacheKey.js";
import { getFriendlyURL } from "./utils/getFriendlyURL.js";
import { logger } from "./utils/logger.js";
import { normalizeHandler } from "./utils/normalizeHandler.js";
import { parseRoute } from "./utils/parseRoute.js";
import { printCleanupDetails } from "./utils/printCleanupDetails.js";
import { printInstallDetails } from "./utils/printInstallDetails.js";
import { waitUntil } from "./utils/waitUntil.js";

declare const self: ServiceWorkerGlobalScope;

export interface FallbackEntry extends PrecacheFallbackEntry {}

export interface FallbacksOptions {
  /**
   * A list of fallback entries.
   */
  entries: FallbackEntry[];
}

export interface PrecacheOptions extends PrecacheRouteOptions {
  /**
   * The cache used for precaching.
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
   * Whether to attempt to get the response from the network if there's
   * a precache miss.
   */
  fallbackToNetwork?: boolean;
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
  /**
   * Plugins to use when precaching as well as responding to fetch
   * events for precached assets.
   */
  plugins?: SerwistPlugin[];
}

export interface SerwistOptions {
  /**
   * A list of URLs that should be cached.
   */
  precacheEntries?: (PrecacheEntry | string)[];
  /**
   * Options to customize how Serwist precaches the URLs in the precache list.
   */
  precacheOptions?: PrecacheOptions;
  /**
   * Forces the waiting service worker to become the active one.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
   */
  skipWaiting?: boolean;
  /**
   * Imports external scripts. They are executed in the order they
   * are passed.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts
   */
  importScripts?: string[];
  /**
   * Enables navigation preloading if it is supported.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/navigationPreload
   */
  navigationPreload?: boolean;
  /**
   * Modifies the prefix of the default cache names used by Serwist packages.
   */
  cacheId?: string | undefined;
  /**
   * Claims any currently available clients once the service worker
   * becomes active. This is normally used in conjunction with `skipWaiting()`.
   *
   * @default false
   */
  clientsClaim?: boolean;
  /**
   * A list of caching strategies.
   */
  runtimeCaching?: RuntimeCaching[];
  /**
   * Your configuration for `initializeGoogleAnalytics`. This plugin is
   * only initialized when this option is not `undefined` or `false`.
   */
  offlineAnalyticsConfig?: Omit<GoogleAnalyticsInitializeOptions, "serwist"> | boolean;
  /**
   * Disables Serwist's logging in development mode.
   *
   * @default false
   */
  disableDevLogs?: boolean;
  /**
   * Precaches routes so that they can be used as a fallback when
   * a `Strategy` fails to generate a response.
   *
   * Note: This option mutates `runtimeCaching`. It also expects the URLs
   * defined in `entries` to have been precached beforehand.
   */
  fallbacks?: FallbacksOptions;
}

type RequestArgs = string | [string, RequestInit?];

interface CacheURLsMessageData {
  type: string;
  payload: {
    urlsToCache: RequestArgs[];
  };
}

/**
 * A class that helps bootstrap the service worker.
 *
 * @see https://serwist.pages.dev/docs/serwist/core/serwist
 */
export class Serwist {
  private readonly _urlsToCacheKeys: Map<string, string> = new Map();
  private readonly _urlsToCacheModes: Map<string, "reload" | "default" | "no-store" | "no-cache" | "force-cache" | "only-if-cached"> = new Map();
  private readonly _cacheKeysToIntegrities: Map<string, string> = new Map();
  private _concurrentPrecaching: number;
  private readonly _precacheStrategy: Strategy;
  private readonly _routes: Map<HTTPMethod, Route[]>;
  private readonly _defaultHandlerMap: Map<HTTPMethod, RouteHandlerObject>;
  private _catchHandler?: RouteHandlerObject;

  constructor({
    precacheEntries,
    precacheOptions,
    skipWaiting = false,
    importScripts,
    navigationPreload = false,
    cacheId,
    clientsClaim = false,
    runtimeCaching,
    offlineAnalyticsConfig,
    disableDevLogs = false,
    fallbacks,
  }: SerwistOptions = {}) {
    this._concurrentPrecaching = precacheOptions?.concurrency ?? 10;
    this._precacheStrategy = new PrecacheStrategy({
      cacheName: privateCacheNames.getPrecacheName(precacheOptions?.cacheName),
      plugins: [...(precacheOptions?.plugins ?? []), new PrecacheCacheKeyPlugin({ precacheController: this })],
      fallbackToNetwork: precacheOptions?.fallbackToNetwork,
    });
    this._routes = new Map();
    this._defaultHandlerMap = new Map();

    this.handleInstall = this.handleInstall.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
    this.handleCache = this.handleCache.bind(this);

    if (!!importScripts && importScripts.length > 0) self.importScripts(...importScripts);

    if (navigationPreload) enableNavigationPreload();

    if (cacheId !== undefined) {
      setCacheNameDetails({
        prefix: cacheId,
      });
    }

    if (skipWaiting) {
      self.skipWaiting();
    } else {
      self.addEventListener("message", (event) => {
        if (event.data && event.data.type === "SKIP_WAITING") {
          self.skipWaiting();
        }
      });
    }

    if (clientsClaim) clientsClaimImpl();

    if (!!precacheEntries && precacheEntries.length > 0) {
      this.addToPrecacheList(precacheEntries);
    }

    if (precacheOptions?.cleanupOutdatedCaches) {
      cleanupOutdatedCachesImpl(precacheOptions?.cacheName);
    }

    this.registerRoute(new PrecacheRoute(this, precacheOptions));

    if (precacheOptions?.navigateFallback) {
      this.registerRoute(
        new NavigationRoute(this.createHandlerBoundToUrl(precacheOptions?.navigateFallback), {
          allowlist: precacheOptions?.navigateFallbackAllowlist,
          denylist: precacheOptions?.navigateFallbackDenylist,
        }),
      );
    }

    if (offlineAnalyticsConfig !== undefined) {
      if (typeof offlineAnalyticsConfig === "boolean") {
        offlineAnalyticsConfig && initializeGoogleAnalytics({ serwist: this });
      } else {
        initializeGoogleAnalytics({
          ...offlineAnalyticsConfig,
          serwist: this,
        });
      }
    }

    if (runtimeCaching !== undefined) {
      if (fallbacks !== undefined) {
        const fallbackPlugin = new PrecacheFallbackPlugin({
          fallbackUrls: fallbacks.entries,
          serwist: this,
        });

        runtimeCaching.forEach((cacheEntry) => {
          if (
            cacheEntry.handler instanceof Strategy &&
            // PrecacheFallbackPlugin also has `handlerDidError`, so we don't need to check for its instances.
            !cacheEntry.handler.plugins.some((plugin) => "handlerDidError" in plugin)
          ) {
            cacheEntry.handler.plugins.push(fallbackPlugin);
          }
        });
      }
      for (const entry of runtimeCaching) {
        this.registerCapture(entry.matcher, entry.handler, entry.method);
      }
    }

    if (disableDevLogs) disableDevLogsImpl();
  }

  /**
   * The strategy used to precache assets and respond to fetch events.
   */
  get precacheStrategy(): Strategy {
    return this._precacheStrategy;
  }
  /**
   * A `Map` of HTTP method name (`'GET'`, etc.) to an array of all corresponding registered `Route`
   * instances.
   */
  get routes(): Map<HTTPMethod, Route[]> {
    return this._routes;
  }

  /**
   * Adds Serwist's event listeners for you. Before calling it, add your own listeners should you need to.
   */
  addEventListeners() {
    self.addEventListener("install", this.handleInstall);
    self.addEventListener("activate", this.handleActivate);
    self.addEventListener("fetch", this.handleFetch);
    self.addEventListener("message", this.handleCache);
  }

  /**
   * Adds items to the precache list, removing duplicates and ensuring the information is valid.
   *
   * @param entries Array of entries to precache.
   */
  addToPrecacheList(entries: (PrecacheEntry | string)[]): void {
    if (process.env.NODE_ENV !== "production") {
      assert!.isArray(entries, {
        moduleName: "serwist",
        className: "Serwist",
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
   * Precaches new and updated assets. Call this method from the service worker's
   * `install` event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param event
   * @returns
   */
  handleInstall(event: ExtendableEvent): Promise<InstallResult> {
    return waitUntil<InstallResult>(event, async () => {
      const installReportPlugin = new PrecacheInstallReportPlugin();
      this.precacheStrategy.plugins.push(installReportPlugin);

      await parallel(this._concurrentPrecaching, Array.from(this._urlsToCacheKeys.entries()), async ([url, cacheKey]): Promise<void> => {
        const integrity = this._cacheKeysToIntegrities.get(cacheKey);
        const cacheMode = this._urlsToCacheModes.get(url);

        const request = new Request(url, {
          integrity,
          cache: cacheMode,
          credentials: "same-origin",
        });

        await Promise.all(
          this.precacheStrategy.handleAll({
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
   * Call this method from the service worker's `activate` event.
   *
   * Note: this method calls `event.waitUntil()` for you, so you do not need
   * to call it yourself in your event handlers.
   *
   * @param event
   * @returns
   */
  handleActivate(event: ExtendableEvent): Promise<CleanupResult> {
    return waitUntil<CleanupResult>(event, async () => {
      const cache = await self.caches.open(this.precacheStrategy.cacheName);
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
   * Gets a `Response` from an appropriate `Route`'s handler. Call this method
   * from the service worker's `fetch` event.
   * @param event
   */
  handleFetch(event: FetchEvent) {
    const { request } = event;
    const responsePromise = this.handleRequest({ request, event });
    if (responsePromise) {
      event.respondWith(responsePromise);
    }
  }

  /**
   * Caches new URLs on demand. Call this method from the service worker's
   * `message` event. To trigger the handler, send a message of type `"CACHE_URLS"`
   * alongside a list of URLs that should be cached as `urlsToCache`.
   * @param event
   */
  handleCache(event: ExtendableMessageEvent) {
    if (event.data && event.data.type === "CACHE_URLS") {
      const { payload }: CacheURLsMessageData = event.data;

      if (process.env.NODE_ENV !== "production") {
        logger.debug("Caching URLs from the window", payload.urlsToCache);
      }

      const requestPromises = Promise.all(
        payload.urlsToCache.map((entry: string | [string, RequestInit?]) => {
          let request: Request;
          if (typeof entry === "string") {
            request = new Request(entry);
          } else {
            request = new Request(...entry);
          }
          return this.handleRequest({ request, event });
        }),
      );

      event.waitUntil(requestPromises);

      // If a MessageChannel was used, reply to the message on success.
      if (event.ports?.[0]) {
        void requestPromises.then(() => event.ports[0].postMessage(true));
      }
    }
  }

  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Each HTTP method (`'GET'`, `'POST'`, etc.) gets its own default handler.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param handler A callback function that returns a `Promise` resulting in a `Response`.
   * @param method The HTTP method to associate with this default handler. Each method
   * has its own default. Defaults to `'GET'`.
   */
  setDefaultHandler(handler: RouteHandler, method: HTTPMethod = defaultMethod): void {
    this._defaultHandlerMap.set(method, normalizeHandler(handler));
  }

  /**
   * If a `Route` throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param handler A callback function that returns a Promise resulting
   * in a Response.
   */
  setCatchHandler(handler: RouteHandler): void {
    this._catchHandler = normalizeHandler(handler);
  }

  /**
   * Registers a `RegExp`, string, or function with a caching
   * strategy to the router.
   *
   * @param capture If the capture param is a `Route`, all other arguments will be ignored.
   * @param handler A callback function that returns a `Promise` resulting in a `Response`.
   * This parameter is required if `capture` is not a `Route` object.
   * @param method The HTTP method to match the Route against. Defaults to `'GET'`.
   * @returns The generated `Route`.
   */
  registerCapture<T extends RegExp | string | RouteMatchCallback | Route>(
    capture: T,
    handler?: T extends Route ? never : RouteHandler,
    method?: T extends Route ? never : HTTPMethod,
  ): Route {
    const route = parseRoute(capture, handler, method);
    this.registerRoute(route);
    return route;
  }

  /**
   * Registers a `Route` with the router.
   *
   * @param route The `Route` to register.
   */
  registerRoute(route: Route): void {
    if (process.env.NODE_ENV !== "production") {
      assert!.isType(route, "object", {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "registerRoute",
        paramName: "route",
      });

      assert!.hasMethod(route, "match", {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "registerRoute",
        paramName: "route",
      });

      assert!.isType(route.handler, "object", {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "registerRoute",
        paramName: "route",
      });

      assert!.hasMethod(route.handler, "handle", {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "registerRoute",
        paramName: "route.handler",
      });

      assert!.isType(route.method, "string", {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "registerRoute",
        paramName: "route.method",
      });
    }

    if (!this._routes.has(route.method)) {
      this._routes.set(route.method, []);
    }

    // Give precedence to all of the earlier routes by adding this additional
    // route to the end of the array.
    this._routes.get(route.method)!.push(route);
  }

  /**
   * Unregisters a `Route` with the router.
   *
   * @param route The `Route` to unregister.
   */
  unregisterRoute(route: Route): void {
    if (!this._routes.has(route.method)) {
      throw new SerwistError("unregister-route-but-not-found-with-method", {
        method: route.method,
      });
    }

    const routeIndex = this._routes.get(route.method)!.indexOf(route);
    if (routeIndex > -1) {
      this._routes.get(route.method)!.splice(routeIndex, 1);
    } else {
      throw new SerwistError("unregister-route-route-not-registered");
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
      const cache = await self.caches.open(this.precacheStrategy.cacheName);
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

      return this.precacheStrategy.handle(options);
    };
  }

  /**
   * Applies the routing rules to a `FetchEvent` object to get a `Response` from an
   * appropriate `Route`'s handler.
   *
   * @param options
   * @returns A promise is returned if a registered route can handle the request.
   * If there is no matching route and there's no `defaultHandler`, `undefined`
   * is returned.
   */
  handleRequest({
    request,
    event,
  }: {
    /**
     * The request to handle.
     */
    request: Request;
    /**
     * The event that triggered the request.
     */
    event: ExtendableEvent;
  }): Promise<Response> | undefined {
    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(request, Request, {
        moduleName: "serwist",
        className: "Serwist",
        funcName: "handleRequest",
        paramName: "options.request",
      });
    }

    const url = new URL(request.url, location.href);
    if (!url.protocol.startsWith("http")) {
      if (process.env.NODE_ENV !== "production") {
        logger.debug("Router only supports URLs that start with 'http'.");
      }
      return;
    }

    const sameOrigin = url.origin === location.origin;
    const { params, route } = this.findMatchingRoute({
      event,
      request,
      sameOrigin,
      url,
    });
    let handler = route?.handler;

    const debugMessages = [];
    if (process.env.NODE_ENV !== "production") {
      if (handler) {
        debugMessages.push(["Found a route to handle this request:", route]);

        if (params) {
          debugMessages.push([`Passing the following params to the route's handler:`, params]);
        }
      }
    }

    // If we don't have a handler because there was no matching route, then
    // fall back to defaultHandler if that's defined.
    const method = request.method as HTTPMethod;
    if (!handler && this._defaultHandlerMap.has(method)) {
      if (process.env.NODE_ENV !== "production") {
        debugMessages.push(`Failed to find a matching route. Falling back to the default handler for ${method}.`);
      }
      handler = this._defaultHandlerMap.get(method);
    }

    if (!handler) {
      if (process.env.NODE_ENV !== "production") {
        // No handler so Serwist will do nothing. If logs is set of debug
        // i.e. verbose, we should print out this information.
        logger.debug(`No route found for: ${getFriendlyURL(url)}`);
      }
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      // We have a handler, meaning Serwist is going to handle the route.
      // print the routing details to the console.
      logger.groupCollapsed(`Router is responding to: ${getFriendlyURL(url)}`);

      for (const msg of debugMessages) {
        if (Array.isArray(msg)) {
          logger.log(...msg);
        } else {
          logger.log(msg);
        }
      }

      logger.groupEnd();
    }

    // Wrap in try and catch in case the handle method throws a synchronous
    // error. It should still callback to the catch handler.
    let responsePromise: Promise<Response>;
    try {
      responsePromise = handler.handle({ url, request, event, params });
    } catch (err) {
      responsePromise = Promise.reject(err);
    }

    // Get route's catch handler, if it exists
    const catchHandler = route?.catchHandler;

    if (responsePromise instanceof Promise && (this._catchHandler || catchHandler)) {
      responsePromise = responsePromise.catch(async (err) => {
        // If there's a route catch handler, process that first
        if (catchHandler) {
          if (process.env.NODE_ENV !== "production") {
            // Still include URL here as it will be async from the console group
            // and may not make sense without the URL
            logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to route's Catch Handler.`);
            logger.error("Error thrown by:", route);
            logger.error(err);
            logger.groupEnd();
          }

          try {
            return await catchHandler.handle({ url, request, event, params });
          } catch (catchErr) {
            if (catchErr instanceof Error) {
              err = catchErr;
            }
          }
        }

        if (this._catchHandler) {
          if (process.env.NODE_ENV !== "production") {
            // Still include URL here as it will be async from the console group
            // and may not make sense without the URL
            logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to global Catch Handler.`);
            logger.error("Error thrown by:", route);
            logger.error(err);
            logger.groupEnd();
          }
          return this._catchHandler.handle({ url, request, event });
        }

        throw err;
      });
    }

    return responsePromise;
  }

  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param options
   * @returns An object with `route` and `params` properties. They are populated
   * if a matching route was found or `undefined` otherwise.
   */
  findMatchingRoute({ url, sameOrigin, request, event }: RouteMatchCallbackOptions): {
    route?: Route;
    params?: RouteHandlerCallbackOptions["params"];
  } {
    const routes = this._routes.get(request.method as HTTPMethod) || [];
    for (const route of routes) {
      let params: Promise<any> | undefined;
      // route.match returns type any, not possible to change right now.
      const matchResult = route.match({ url, sameOrigin, request, event });
      if (matchResult) {
        if (process.env.NODE_ENV !== "production") {
          // Warn developers that using an async matchCallback is almost always
          // not the right thing to do.
          if (matchResult instanceof Promise) {
            logger.warn(
              `While routing ${getFriendlyURL(
                url,
              )}, an async matchCallback function was used. Please convert the following route to use a synchronous matchCallback function:`,
              route,
            );
          }
        }

        // See https://github.com/GoogleChrome/workbox/issues/2079
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        params = matchResult;
        if (Array.isArray(params) && params.length === 0) {
          // Instead of passing an empty array in as params, use undefined.
          params = undefined;
        } else if (
          matchResult.constructor === Object && // eslint-disable-line
          Object.keys(matchResult).length === 0
        ) {
          // Instead of passing an empty object in as params, use undefined.
          params = undefined;
        } else if (typeof matchResult === "boolean") {
          // For the boolean value true (rather than just something truth-y),
          // don't set params.
          // See https://github.com/GoogleChrome/workbox/pull/2134#issuecomment-513924353
          params = undefined;
        }

        // Return early if have a match.
        return { route, params };
      }
    }
    // If no match was found above, return and empty object.
    return {};
  }
}
