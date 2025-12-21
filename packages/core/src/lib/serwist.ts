import { createSerwist, type Serwist as SerwistState } from "#lib/core.js";
import type { GoogleAnalyticsOptions, Precache, PrecacheFallbackEntry, PrecacheOptions } from "#lib/extensions/index.js";
import { GoogleAnalytics, RuntimeCache } from "#lib/extensions/index.js";
import {
  createActivateHandler,
  createCacheHandler,
  createFetchHandler,
  createInstallHandler,
  setCatchHandler,
  setDefaultHandler,
} from "#lib/functions/handlers.js";
import { findMatchingRoute, handleRequest, registerCapture, registerRoute, unregisterRoute } from "#lib/functions/router.js";
import type { Strategy } from "#lib/strategies/core.js";
import type { HTTPMethod } from "./constants.js";
import type { Extension } from "./extension.js";
import type { Route } from "./route.js";
import type {
  PrecacheEntry,
  RouteHandler,
  RouteHandlerCallback,
  RouteHandlerCallbackOptions,
  RouteMatchCallback,
  RouteMatchCallbackOptions,
  RuntimeCaching,
} from "./types.js";

declare const self: ServiceWorkerGlobalScope;

export interface FallbackEntry extends PrecacheFallbackEntry {}

export interface FallbacksOptions {
  /**
   * A list of fallback entries.
   */
  entries: FallbackEntry[];
}

/**
 * @deprecated Legacy `Serwist` class. Please migrate to `createSerwist`.
 */
export interface SerwistOptions {
  /**
   * A list of URLs that should be cached.
   */
  precacheEntries?: (PrecacheEntry | string)[];
  /**
   * Options to customize how Serwist precaches the URLs in the precache list.
   */
  precacheOptions?: Omit<PrecacheOptions, "entries">;
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
   * Your configuration for {@linkcode GoogleAnalytics}. This plugin is
   * only initialized when this option is not `undefined` or `false`.
   */
  offlineAnalyticsConfig?: GoogleAnalyticsOptions | boolean;
  /**
   * Disables Serwist's logging in development mode.
   *
   * @default false
   */
  disableDevLogs?: boolean;
  /**
   * Precaches routes so that they can be used as a fallback when
   * a {@linkcode Strategy} fails to generate a response.
   *
   * Note: This option mutates `runtimeCaching`. It also expects the URLs
   * defined in `entries` to have been precached beforehand.
   */
  fallbacks?: FallbacksOptions;
  /**
   * A list of extensions.
   */
  extensions?: Extension[];
}

/**
 * A class that helps bootstrap the service worker.
 *
 * @deprecated Legacy `Serwist` class. Please migrate to `createSerwist`.
 * @see https://serwist.pages.dev/docs/serwist/core/serwist
 */
export class Serwist {
  private readonly _state: SerwistState;
  private readonly _installHandler: (event: ExtendableEvent) => Promise<void>;
  private readonly _activateHandler: (event: ExtendableEvent) => Promise<void>;
  private readonly _fetchHandler: (event: FetchEvent) => void;
  private readonly _cacheHandler: (event: ExtendableMessageEvent) => void;

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
    extensions,
  }: SerwistOptions = {}) {
    this.handleInstall = this.handleInstall.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.handleFetch = this.handleFetch.bind(this);
    this.handleCache = this.handleCache.bind(this);

    this._state = createSerwist({
      precache: { entries: precacheEntries ?? [], ...precacheOptions },
      extensions: [
        !extensions?.some((ext) => ext instanceof RuntimeCache) && runtimeCaching !== undefined
          ? new RuntimeCache(runtimeCaching, { fallbacks })
          : undefined,
        !extensions?.some((ext) => ext instanceof GoogleAnalytics) && offlineAnalyticsConfig !== undefined
          ? typeof offlineAnalyticsConfig === "boolean"
            ? offlineAnalyticsConfig
              ? new GoogleAnalytics()
              : undefined
            : new GoogleAnalytics(offlineAnalyticsConfig)
          : undefined,
        ...(extensions ?? []),
      ].filter((extension) => extension !== undefined),
      skipWaiting,
      importScripts,
      navigationPreload,
      cacheId,
      clientsClaim,
      disableDevLogs,
    });

    this._installHandler = createInstallHandler(this._state);
    this._activateHandler = createActivateHandler(this._state);
    this._fetchHandler = createFetchHandler(this._state);
    this._cacheHandler = createCacheHandler(this._state);
  }

  /**
   * The {@linkcode Precache} used to handle precaching.
   */
  get precache(): Precache {
    return this._state.precache;
  }

  /**
   * The strategy used to precache assets and respond to `fetch` events.
   */
  get precacheStrategy(): Strategy {
    return this._state.precache.strategy;
  }

  /**
   * A `Map` of HTTP method name (`'GET'`, etc.) to an array of all corresponding registered {@linkcode Route}
   * instances.
   */
  get routes(): Map<HTTPMethod, Route[]> {
    return this._state.routes;
  }

  get state(): SerwistState {
    return this._state;
  }

  /**
   * Adds Serwist's event listeners. Before calling it, add your own listeners should you need to.
   */
  addEventListeners() {
    self.addEventListener("install", this._installHandler);
    self.addEventListener("activate", this._activateHandler);
    self.addEventListener("fetch", this._fetchHandler);
    self.addEventListener("message", this._cacheHandler);
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
  handleInstall(event: ExtendableEvent): Promise<void> {
    return this._installHandler(event);
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
  handleActivate(event: ExtendableEvent): Promise<void> {
    return this._activateHandler(event);
  }

  /**
   * Gets a `Response` from an appropriate `Route`'s handler. Call this method
   * from the service worker's `fetch` event.
   * @param event
   */
  handleFetch(event: FetchEvent) {
    return this._fetchHandler(event);
  }

  /**
   * Caches new URLs on demand. Call this method from the service worker's
   * `message` event. To trigger the handler, send a message of type `"CACHE_URLS"`
   * alongside a list of URLs that should be cached as `urlsToCache`.
   * @param event
   */
  handleCache(event: ExtendableMessageEvent) {
    return this._cacheHandler(event);
  }

  /**
   * Define a default handler that's called when no routes explicitly
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
  setDefaultHandler(handler: RouteHandler, method?: HTTPMethod): void {
    setDefaultHandler(this._state, handler, method);
  }

  /**
   * If a {@linkcode Route} throws an error while handling a request, this handler
   * will be called and given a chance to provide a response.
   *
   * @param handler A callback function that returns a `Promise` resulting
   * in a `Response`.
   */
  setCatchHandler(handler: RouteHandler): void {
    setCatchHandler(this._state, handler);
  }

  /**
   * Registers a `RegExp`, string, or function with a caching
   * strategy to the router.
   *
   * @param capture If the capture param is a {@linkcode Route} object, all other arguments will be ignored.
   * @param handler A callback function that returns a `Promise` resulting in a `Response`.
   * This parameter is required if `capture` is not a {@linkcode Route} object.
   * @param method The HTTP method to match the route against. Defaults to `'GET'`.
   * @returns The generated {@linkcode Route} object.
   */
  registerCapture<T extends RegExp | string | RouteMatchCallback | Route>(
    capture: T,
    handler?: T extends Route ? never : RouteHandler,
    method?: T extends Route ? never : HTTPMethod,
  ): Route {
    return registerCapture(this._state, capture, handler, method);
  }

  /**
   * Registers a {@linkcode Route} with the router.
   *
   * @param route The {@linkcode Route} to register.
   */
  registerRoute(route: Route): void {
    registerRoute(this._state, route);
  }

  /**
   * Unregisters a route from the router.
   *
   * @param route The {@linkcode Route} object to unregister.
   */
  unregisterRoute(route: Route): void {
    unregisterRoute(this._state, route);
  }

  /**
   * Applies the routing rules to a `FetchEvent` object to get a response from an
   * appropriate route.
   *
   * @param options
   * @returns A promise is returned if a registered route can handle the request.
   * If there is no matching route and there's no default handler, `undefined`
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
    return handleRequest(this._state, { request, event });
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
    return findMatchingRoute(this._state, { url, sameOrigin, request, event });
  }

  // The following are deprecated methods:

  /**
   * Adds items to the precache list, removing duplicates and ensuring the information is valid.
   *
   * @param entries Array of entries to precache.
   */
  addToPrecacheList(entries: (PrecacheEntry | string)[]): void {
    this.precache.addToCacheList(entries);
  }

  /**
   * Returns a mapping of a precached URL to the corresponding cache key, taking
   * into account the revision information for the URL.
   *
   * @returns A URL to cache key mapping.
   */
  getUrlsToPrecacheKeys(): Map<string, string> {
    return this.precache.getUrlsToPrecacheKeys();
  }

  /**
   * Returns a list of all the URLs that have been precached by the current
   * service worker.
   *
   * @returns The precached URLs.
   */
  getPrecachedUrls(): string[] {
    return this.precache.getPrecachedUrls();
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
    return this.precache.getPrecacheKeyForUrl(url);
  }

  /**
   * @param url A cache key whose SRI you want to look up.
   * @returns The subresource integrity associated with the cache key,
   * or undefined if it's not set.
   */
  getIntegrityForPrecacheKey(cacheKey: string): string | undefined {
    return this.precache.getIntegrityForPrecacheKey(cacheKey);
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
  matchPrecache(request: string | Request): Promise<Response | undefined> {
    return this.precache.matchPrecache(request);
  }

  /**
   * Returns a function that looks up `url` in the precache (taking into
   * account revision information), and returns the corresponding `Response`.
   *
   * @param url The precached URL which will be used to lookup the response.
   * @return
   */
  createHandlerBoundToUrl(url: string): RouteHandlerCallback {
    return this.precache.createHandlerBoundToUrl(url);
  }
}
