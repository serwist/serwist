/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { HandlerCallbackOptions, MapLikeObject, SerwistPlugin, SerwistPluginCallbackParam } from "../../types.js";
import { Deferred } from "../../utils/Deferred.js";
import { SerwistError } from "../../utils/SerwistError.js";
import { assert } from "../../utils/assert.js";
import { cacheMatchIgnoreParams } from "../../utils/cacheMatchIgnoreParams.js";
import { executeQuotaErrorCallbacks } from "../../utils/executeQuotaErrorCallbacks.js";
import { getFriendlyURL } from "../../utils/getFriendlyURL.js";
import { logger } from "../../utils/logger.js";
import { timeout } from "../../utils/timeout.js";
import type { Strategy } from "./Strategy.js";

function toRequest(input: RequestInfo) {
  return typeof input === "string" ? new Request(input) : input;
}

/**
 * A class created every time a `Strategy` instance calls `Strategy.handle` or
 * `Strategy.handleAll` that wraps all fetch and cache actions around plugin callbacks
 * and keeps track of when the strategy is "done" (i.e. when all added `event.waitUntil()` promises
 * have resolved).
 */
export class StrategyHandler {
  /**
   * The event associated with this request.
   */
  public event: ExtendableEvent;
  /**
   * The request the strategy is processing (passed to the strategy's
   * `handle()` or `handleAll()` method).
   */
  public request: Request;
  /**
   * A `URL` instance of `request.url` (if passed to the strategy's
   * `handle()` or `handleAll()` method).
   * Note: the `url` param will be present if the strategy is invoked
   * from a `Route` object.
   */
  public url?: URL;
  /**
   * Some additional params (if passed to the strategy's
   * `handle()` or `handleAll()` method).
   * Note: the `params` param will be present if the strategy is invoked
   * from a `Route` object and that route's matcher returned a truthy value
   * (it will be that value).
   */
  public params?: string[] | MapLikeObject;

  private _cacheKeys: Record<string, Request> = {};
  private readonly _strategy: Strategy;
  private readonly _handlerDeferred: Deferred<any>;
  private readonly _extendLifetimePromises: Promise<any>[];
  private readonly _plugins: SerwistPlugin[];
  private readonly _pluginStateMap: Map<SerwistPlugin, MapLikeObject>;

  /**
   * Creates a new instance associated with the passed strategy and event
   * that's handling the request.
   *
   * The constructor also initializes the state that will be passed to each of
   * the plugins handling this request.
   *
   * @param strategy
   * @param options
   */
  constructor(
    strategy: Strategy,
    options: HandlerCallbackOptions & {
      request: HandlerCallbackOptions["request"] & Request;
    },
  ) {
    if (process.env.NODE_ENV !== "production") {
      assert!.isInstance(options.event, ExtendableEvent, {
        moduleName: "serwist",
        className: "StrategyHandler",
        funcName: "constructor",
        paramName: "options.event",
      });
      assert!.isInstance(options.request, Request, {
        moduleName: "serwist",
        className: "StrategyHandler",
        funcName: "constructor",
        paramName: "options.request",
      });
    }

    this.event = options.event;
    this.request = options.request;
    if (options.url) {
      this.url = options.url;
      this.params = options.params;
    }
    this._strategy = strategy;
    this._handlerDeferred = new Deferred();
    this._extendLifetimePromises = [];

    // Copy the plugins list (since it's mutable on the strategy),
    // so any mutations don't affect this handler instance.
    this._plugins = [...strategy.plugins];
    this._pluginStateMap = new Map();
    for (const plugin of this._plugins) {
      this._pluginStateMap.set(plugin, {});
    }

    this.event.waitUntil(this._handlerDeferred.promise);
  }

  /**
   * Fetches a given request (and invokes any applicable plugin callback
   * methods), taking the `fetchOptions` (for non-navigation requests) and
   * `plugins` provided to the `Strategy` object into account.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - `requestWillFetch()`
   * - `fetchDidSucceed()`
   * - `fetchDidFail()`
   *
   * @param input The URL or request to fetch.
   * @returns
   */
  async fetch(input: RequestInfo): Promise<Response> {
    const { event } = this;
    let request: Request = toRequest(input);

    if (request.mode === "navigate" && event instanceof FetchEvent && event.preloadResponse) {
      const possiblePreloadResponse = (await event.preloadResponse) as Response | undefined;
      if (possiblePreloadResponse) {
        if (process.env.NODE_ENV !== "production") {
          logger.log(`Using a preloaded navigation response for '${getFriendlyURL(request.url)}'`);
        }
        return possiblePreloadResponse;
      }
    }

    // If there is a fetchDidFail plugin, we need to save a clone of the
    // original request before it's either modified by a requestWillFetch
    // plugin or before the original request's body is consumed via fetch().
    const originalRequest = this.hasCallback("fetchDidFail") ? request.clone() : null;

    try {
      for (const cb of this.iterateCallbacks("requestWillFetch")) {
        request = await cb({ request: request.clone(), event });
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new SerwistError("plugin-error-request-will-fetch", {
          thrownErrorMessage: err.message,
        });
      }
    }

    // The request can be altered by plugins with `requestWillFetch` making
    // the original request (most likely from a `fetch` event) different
    // from the Request we make. Pass both to `fetchDidFail` to aid debugging.
    const pluginFilteredRequest: Request = request.clone();

    try {
      let fetchResponse: Response;

      // See https://github.com/GoogleChrome/workbox/issues/1796
      fetchResponse = await fetch(request, request.mode === "navigate" ? undefined : this._strategy.fetchOptions);

      if (process.env.NODE_ENV !== "production") {
        logger.debug(`Network request for '${getFriendlyURL(request.url)}' returned a response with status '${fetchResponse.status}'.`);
      }

      for (const callback of this.iterateCallbacks("fetchDidSucceed")) {
        fetchResponse = await callback({
          event,
          request: pluginFilteredRequest,
          response: fetchResponse,
        });
      }
      return fetchResponse;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        logger.log(`Network request for '${getFriendlyURL(request.url)}' threw an error.`, error);
      }

      // `originalRequest` will only exist if a `fetchDidFail` callback
      // is being used (see above).
      if (originalRequest) {
        await this.runCallbacks("fetchDidFail", {
          error: error as Error,
          event,
          originalRequest: originalRequest.clone(),
          request: pluginFilteredRequest.clone(),
        });
      }
      throw error;
    }
  }

  /**
   * Calls `this.fetch()` and (in the background) caches the generated response.
   *
   * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
   * so you do not have to call `waitUntil()` yourself.
   *
   * @param input The request or URL to fetch and cache.
   * @returns
   */
  async fetchAndCachePut(input: RequestInfo): Promise<Response> {
    const response = await this.fetch(input);
    const responseClone = response.clone();

    void this.waitUntil(this.cachePut(input, responseClone));

    return response;
  }

  /**
   * Matches a request from the cache (and invokes any applicable plugin
   * callback method) using the `cacheName`, `matchOptions`, and `plugins`
   * provided to the `Strategy` object.
   *
   * The following lifecycle methods are invoked when using this method:
   * - `cacheKeyWillBeUsed`
   * - `cachedResponseWillBeUsed`
   *
   * @param key The `Request` or `URL` object to use as the cache key.
   * @returns A matching response, if found.
   */
  async cacheMatch(key: RequestInfo): Promise<Response | undefined> {
    const request: Request = toRequest(key);
    let cachedResponse: Response | undefined;
    const { cacheName, matchOptions } = this._strategy;

    const effectiveRequest = await this.getCacheKey(request, "read");
    const multiMatchOptions = { ...matchOptions, ...{ cacheName } };

    cachedResponse = await caches.match(effectiveRequest, multiMatchOptions);

    if (process.env.NODE_ENV !== "production") {
      if (cachedResponse) {
        logger.debug(`Found a cached response in '${cacheName}'.`);
      } else {
        logger.debug(`No cached response found in '${cacheName}'.`);
      }
    }

    for (const callback of this.iterateCallbacks("cachedResponseWillBeUsed")) {
      cachedResponse =
        (await callback({
          cacheName,
          matchOptions,
          cachedResponse,
          request: effectiveRequest,
          event: this.event,
        })) || undefined;
    }
    return cachedResponse;
  }

  /**
   * Puts a request/response pair into the cache (and invokes any applicable
   * plugin callback method) using the `cacheName` and `plugins` provided to
   * the `Strategy` object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - `cacheKeyWillBeUsed`
   * - `cacheWillUpdate`
   * - `cacheDidUpdate`
   *
   * @param key The request or URL to use as the cache key.
   * @param response The response to cache.
   * @returns `false` if a cacheWillUpdate caused the response
   * not be cached, and `true` otherwise.
   */
  async cachePut(key: RequestInfo, response: Response): Promise<boolean> {
    const request: Request = toRequest(key);

    // Run in the next task to avoid blocking other cache reads.
    // https://github.com/w3c/ServiceWorker/issues/1397
    await timeout(0);

    const effectiveRequest = await this.getCacheKey(request, "write");

    if (process.env.NODE_ENV !== "production") {
      if (effectiveRequest.method && effectiveRequest.method !== "GET") {
        throw new SerwistError("attempt-to-cache-non-get-request", {
          url: getFriendlyURL(effectiveRequest.url),
          method: effectiveRequest.method,
        });
      }
    }

    if (!response) {
      if (process.env.NODE_ENV !== "production") {
        logger.error(`Cannot cache non-existent response for '${getFriendlyURL(effectiveRequest.url)}'.`);
      }

      throw new SerwistError("cache-put-with-no-response", {
        url: getFriendlyURL(effectiveRequest.url),
      });
    }

    const responseToCache = await this._ensureResponseSafeToCache(response);

    if (!responseToCache) {
      if (process.env.NODE_ENV !== "production") {
        logger.debug(`Response '${getFriendlyURL(effectiveRequest.url)}' will not be cached.`, responseToCache);
      }
      return false;
    }

    const { cacheName, matchOptions } = this._strategy;
    const cache = await self.caches.open(cacheName);

    if (process.env.NODE_ENV !== "production") {
      // See https://github.com/GoogleChrome/workbox/issues/2818
      const vary = response.headers.get("Vary");
      if (vary && matchOptions?.ignoreVary !== true) {
        logger.debug(
          `The response for ${getFriendlyURL(
            effectiveRequest.url,
          )} has a 'Vary: ${vary}' header. Consider setting the {ignoreVary: true} option on your strategy to ensure cache matching and deletion works as expected.`,
        );
      }
    }

    const hasCacheUpdateCallback = this.hasCallback("cacheDidUpdate");
    const oldResponse = hasCacheUpdateCallback
      ? await cacheMatchIgnoreParams(
          // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
          // feature. Consider into ways to only add this behavior if using
          // precaching.
          cache,
          effectiveRequest.clone(),
          ["__WB_REVISION__"],
          matchOptions,
        )
      : null;

    if (process.env.NODE_ENV !== "production") {
      logger.debug(`Updating the '${cacheName}' cache with a new Response for ${getFriendlyURL(effectiveRequest.url)}.`);
    }

    try {
      await cache.put(effectiveRequest, hasCacheUpdateCallback ? responseToCache.clone() : responseToCache);
    } catch (error) {
      if (error instanceof Error) {
        // See https://developer.mozilla.org/en-US/docs/Web/API/DOMException#exception-QuotaExceededError
        if (error.name === "QuotaExceededError") {
          await executeQuotaErrorCallbacks();
        }
        throw error;
      }
    }

    for (const callback of this.iterateCallbacks("cacheDidUpdate")) {
      await callback({
        cacheName,
        oldResponse,
        newResponse: responseToCache.clone(),
        request: effectiveRequest,
        event: this.event,
      });
    }

    return true;
  }

  /**
   * Checks the `plugins` provided to the `Strategy` object for `cacheKeyWillBeUsed`
   * callbacks and executes found callbacks in sequence. The final `Request`
   * object returned by the last plugin is treated as the cache key for cache
   * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
   * been registered, the passed request is returned unmodified.
   *
   * @param request
   * @param mode
   * @returns
   */
  async getCacheKey(request: Request, mode: "read" | "write"): Promise<Request> {
    const key = `${request.url} | ${mode}`;
    if (!this._cacheKeys[key]) {
      let effectiveRequest = request;

      for (const callback of this.iterateCallbacks("cacheKeyWillBeUsed")) {
        effectiveRequest = toRequest(
          await callback({
            mode,
            request: effectiveRequest,
            event: this.event,
            params: this.params,
          }),
        );
      }

      this._cacheKeys[key] = effectiveRequest;
    }
    return this._cacheKeys[key];
  }

  /**
   * Returns `true` if the strategy has at least one plugin with the given
   * callback.
   *
   * @param name The name of the callback to check for.
   * @returns
   */
  hasCallback<C extends keyof SerwistPlugin>(name: C): boolean {
    for (const plugin of this._strategy.plugins) {
      if (name in plugin) {
        return true;
      }
    }
    return false;
  }

  /**
   * Runs all plugin callbacks matching the given name, in order, passing the
   * given param object as the only argument.
   *
   * Note: since this method runs all plugins, it's not suitable for cases
   * where the return value of a callback needs to be applied prior to calling
   * the next callback. See `serwist/strategies.iterateCallbacks` for how to handle that case.
   *
   * @param name The name of the callback to run within each plugin.
   * @param param The object to pass as the first (and only) param when executing each callback. This object will be merged with the
   * current plugin state prior to callback execution.
   */
  async runCallbacks<C extends keyof NonNullable<SerwistPlugin>>(name: C, param: Omit<SerwistPluginCallbackParam[C], "state">): Promise<void> {
    for (const callback of this.iterateCallbacks(name)) {
      // TODO(philipwalton): not sure why `any` is needed. It seems like
      // this should work with `as SerwistPluginCallbackParam[C]`.
      await callback(param as any);
    }
  }

  /**
   * Accepts a callback name and returns an iterable of matching plugin callbacks.
   *
   * @param name The name fo the callback to run
   * @returns
   */
  *iterateCallbacks<C extends keyof SerwistPlugin>(name: C): Generator<NonNullable<SerwistPlugin[C]>> {
    for (const plugin of this._strategy.plugins) {
      if (typeof plugin[name] === "function") {
        const state = this._pluginStateMap.get(plugin);
        const statefulCallback = (param: Omit<SerwistPluginCallbackParam[C], "state">) => {
          const statefulParam = { ...param, state };

          // TODO(philipwalton): not sure why `any` is needed. It seems like
          // this should work with `as WorkboxPluginCallbackParam[C]`.
          return plugin[name]!(statefulParam as any);
        };
        yield statefulCallback as NonNullable<SerwistPlugin[C]>;
      }
    }
  }

  /**
   * Adds a promise to the
   * [extend lifetime promises](https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises)
   * of the event event associated with the request being handled (usually a `FetchEvent`).
   *
   * Note: you can await
   * `serwist/strategies.StrategyHandler.doneWaiting`
   * to know when all added promises have settled.
   *
   * @param promise A promise to add to the extend lifetime promises of
   * the event that triggered the request.
   */
  waitUntil<T>(promise: Promise<T>): Promise<T> {
    this._extendLifetimePromises.push(promise);
    return promise;
  }

  /**
   * Returns a promise that resolves once all promises passed to
   * `this.waitUntil()` have settled.
   *
   * Note: any work done after `doneWaiting()` settles should be manually
   * passed to an event's `waitUntil()` method (not `this.waitUntil()`), otherwise
   * the service worker thread may be killed prior to your work completing.
   */
  async doneWaiting(): Promise<void> {
    let promise: Promise<any> | undefined = undefined;
    while ((promise = this._extendLifetimePromises.shift())) {
      await promise;
    }
  }

  /**
   * Stops running the strategy and immediately resolves any pending
   * `waitUntil()` promise.
   */
  destroy(): void {
    this._handlerDeferred.resolve(null);
  }

  /**
   * This method will call `cacheWillUpdate` on the available plugins (or use
   * status === 200) to determine if the response is safe and valid to cache.
   *
   * @param response
   * @returns
   * @private
   */
  async _ensureResponseSafeToCache(response: Response): Promise<Response | undefined> {
    let responseToCache: Response | undefined = response;
    let pluginsUsed = false;

    for (const callback of this.iterateCallbacks("cacheWillUpdate")) {
      responseToCache =
        (await callback({
          request: this.request,
          response: responseToCache,
          event: this.event,
        })) || undefined;
      pluginsUsed = true;

      if (!responseToCache) {
        break;
      }
    }

    if (!pluginsUsed) {
      if (responseToCache && responseToCache.status !== 200) {
        responseToCache = undefined;
      }
      if (process.env.NODE_ENV !== "production") {
        if (responseToCache) {
          if (responseToCache.status !== 200) {
            if (responseToCache.status === 0) {
              logger.warn(
                `The response for '${this.request.url}' is an opaque response. The caching strategy that you're using will not cache opaque responses by default.`,
              );
            } else {
              logger.debug(`The response for '${this.request.url}' returned a status code of '${response.status}' and won't be cached as a result.`);
            }
          }
        }
      }
    }

    return responseToCache;
  }
}
