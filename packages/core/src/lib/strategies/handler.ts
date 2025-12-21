import { assert, Deferred } from "#index.internal";
import type { HandlerCallbackOptions, MapLikeObject, StrategyPlugin, StrategyPluginCallbackParam } from "#lib/types.js";
import { cacheMatchIgnoreParams } from "#utils/cacheMatchIgnoreParams.js";
import { executeQuotaErrorCallbacks } from "#utils/executeQuotaErrorCallbacks.js";
import { getFriendlyURL } from "#utils/getFriendlyURL.js";
import { logger } from "#utils/logger.js";
import { SerwistError } from "#utils/SerwistError.js";
import { timeout } from "#utils/timeout.js";
import type { Strategy } from "./core.js";

function toRequest(input: RequestInfo) {
  return typeof input === "string" ? new Request(input) : input;
}

export interface StrategyHandler {
  /**
   * The event associated with this request.
   */
  event: ExtendableEvent;
  /**
   * The request the strategy is processing (passed to the strategy's
   * `handle()` or `handleAll()` method).
   */
  request: Request;
  /**
   * A `URL` instance of `request.url` (if passed to the strategy's
   * `handle()` or `handleAll()` method).
   * Note: the `url` param will be present if the strategy is invoked
   * from a {@linkcode Route} object.
   */
  url?: URL;
  /**
   * Some additional params (if passed to the strategy's
   * `handle()` or `handleAll()` method).
   *
   * Note: the `params` param will be present if the strategy is invoked
   * from a {@linkcode Route} object and that route's matcher returned a truthy
   * value (it will be that value).
   */
  params?: string[] | MapLikeObject;
  strategy: Strategy;
  readonly cacheKeys: Record<string, Request>;
  readonly handlerDeferred: Deferred<any>;
  readonly extendLifetimePromises: Promise<any>[];
  readonly plugins: StrategyPlugin[];
  readonly pluginStateMap: Map<StrategyPlugin, MapLikeObject>;
}

export const createHandler = (
  strategy: Strategy,
  options: HandlerCallbackOptions & {
    request: HandlerCallbackOptions["request"] & Request;
  },
): StrategyHandler => {
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

  const handlerDeferred = new Deferred();
  options.event.waitUntil(handlerDeferred.promise);

  const plugins = [...strategy.plugins];
  const pluginStateMap = new Map();
  for (const plugin of plugins) {
    pluginStateMap.set(plugin, {});
  }

  return {
    event: options.event,
    request: options.request,
    ...(options.url
      ? {
          url: options.url,
          params: options.params,
        }
      : {}),
    strategy,
    cacheKeys: {},
    handlerDeferred,
    extendLifetimePromises: [],
    plugins,
    pluginStateMap,
  };
};

/**
 * Fetches a given request (and invokes any applicable plugin callback
 * methods), taking the `fetchOptions` (for non-navigation requests) and
 * `plugins` provided to the {@linkcode Strategy} object into account.
 *
 * The following plugin lifecycle methods are invoked when using this method:
 * - `requestWillFetch()`
 * - `fetchDidSucceed()`
 * - `fetchDidFail()`
 *
 * @param input The URL or request to fetch.
 * @returns
 */
export const fetch = async (handler: StrategyHandler, input: RequestInfo): Promise<Response> => {
  const { event } = handler;
  let request: Request = toRequest(input);

  const preloadResponse = await getPreloadResponse(handler);

  if (preloadResponse) {
    return preloadResponse;
  }

  // If there is a fetchDidFail plugin, we need to save a clone of the
  // original request before it's either modified by a requestWillFetch
  // plugin or before the original request's body is consumed via fetch().
  const originalRequest = hasCallback(handler, "fetchDidFail") ? request.clone() : null;

  try {
    for (const cb of iterateCallbacks(handler, "requestWillFetch")) {
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
    fetchResponse = await globalThis.fetch(request, request.mode === "navigate" ? undefined : handler.strategy.fetchOptions);

    if (process.env.NODE_ENV !== "production") {
      logger.debug(`Network request for '${getFriendlyURL(request.url)}' returned a response with status '${fetchResponse.status}'.`);
    }

    for (const callback of iterateCallbacks(handler, "fetchDidSucceed")) {
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
      await runCallbacks(handler, "fetchDidFail", {
        error: error as Error,
        event,
        originalRequest: originalRequest.clone(),
        request: pluginFilteredRequest.clone(),
      });
    }
    throw error;
  }
};

/**
 * Calls `this.fetch()` and (in the background) caches the generated response.
 *
 * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
 * so you do not have to call `waitUntil()` yourself.
 *
 * @param input The request or URL to fetch and cache.
 * @returns
 */
export const fetchAndCachePut = async (handler: StrategyHandler, input: RequestInfo): Promise<Response> => {
  const response = await fetch(handler, input);
  const responseClone = response.clone();

  void waitUntil(handler, cachePut(handler, input, responseClone));

  return response;
};

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
export const cacheMatch = async (handler: StrategyHandler, key: RequestInfo): Promise<Response | undefined> => {
  const request: Request = toRequest(key);
  let cachedResponse: Response | undefined;
  const { cacheName, matchOptions } = handler.strategy;

  const effectiveRequest = await getCacheKey(handler, request, "read");
  const multiMatchOptions = { ...matchOptions, ...{ cacheName } };

  cachedResponse = await caches.match(effectiveRequest, multiMatchOptions);

  if (process.env.NODE_ENV !== "production") {
    if (cachedResponse) {
      logger.debug(`Found a cached response in '${cacheName}'.`);
    } else {
      logger.debug(`No cached response found in '${cacheName}'.`);
    }
  }

  for (const callback of iterateCallbacks(handler, "cachedResponseWillBeUsed")) {
    cachedResponse =
      (await callback({
        cacheName,
        matchOptions,
        cachedResponse,
        request: effectiveRequest,
        event: handler.event,
      })) || undefined;
  }
  return cachedResponse;
};

/**
 * Puts a request/response pair into the cache (and invokes any applicable
 * plugin callback method) using the `cacheName` and `plugins` provided to
 * the {@linkcode Strategy} object.
 *
 * The following plugin lifecycle methods are invoked when using this method:
 * - `cacheKeyWillBeUsed`
 * - `cacheWillUpdate`
 * - `cacheDidUpdate`
 *
 * @param key The request or URL to use as the cache key.
 * @param response The response to cache.
 * @returns `false` if a `cacheWillUpdate` caused the response to
 * not be cached, and `true` otherwise.
 */
export const cachePut = async (handler: StrategyHandler, key: RequestInfo, response: Response): Promise<boolean> => {
  const request: Request = toRequest(key);

  // Run in the next task to avoid blocking other cache reads.
  // https://github.com/w3c/ServiceWorker/issues/1397
  await timeout(0);

  const effectiveRequest = await getCacheKey(handler, request, "write");

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

  const responseToCache = await ensureResponseSafeToCache(handler, response);

  if (!responseToCache) {
    if (process.env.NODE_ENV !== "production") {
      logger.debug(`Response '${getFriendlyURL(effectiveRequest.url)}' will not be cached.`, responseToCache);
    }
    return false;
  }

  const { cacheName, matchOptions } = handler.strategy;
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

  const hasCacheUpdateCallback = hasCallback(handler, "cacheDidUpdate");
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

  for (const callback of iterateCallbacks(handler, "cacheDidUpdate")) {
    await callback({
      cacheName,
      oldResponse,
      newResponse: responseToCache.clone(),
      request: effectiveRequest,
      event: handler.event,
    });
  }

  return true;
};

/**
 * Checks the `plugins` provided to the {@linkcode Strategy} object for `cacheKeyWillBeUsed`
 * callbacks and executes found callbacks in sequence. The final `Request`
 * object returned by the last plugin is treated as the cache key for cache
 * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
 * been registered, the passed request is returned unmodified.
 *
 * @param request
 * @param mode
 * @returns
 */
export const getCacheKey = async (handler: StrategyHandler, request: Request, mode: "read" | "write"): Promise<Request> => {
  const key = `${request.url} | ${mode}`;
  if (!handler.cacheKeys[key]) {
    let effectiveRequest = request;

    for (const callback of iterateCallbacks(handler, "cacheKeyWillBeUsed")) {
      effectiveRequest = toRequest(
        await callback({
          mode,
          request: effectiveRequest,
          event: handler.event,
          params: handler.params,
        }),
      );
    }

    handler.cacheKeys[key] = effectiveRequest;
  }
  return handler.cacheKeys[key];
};

/**
 * Adds a promise to the
 * [extend lifetime promises](https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises)
 * of the event event associated with the request being handled (usually a `FetchEvent`).
 *
 * Note: you can await {@linkcode StrategyHandler.doneWaiting} to know when all added promises have settled.
 *
 * @param promise A promise to add to the extend lifetime promises of
 * the event that triggered the request.
 */
export const waitUntil = <T>(handler: StrategyHandler, promise: Promise<T>): Promise<T> => {
  handler.extendLifetimePromises.push(promise);
  return promise;
};

/**
 * Returns a promise that resolves once all promises passed to
 * `this.waitUntil()` have settled.
 *
 * Note: any work done after `doneWaiting()` settles should be manually
 * passed to an event's `waitUntil()` method (not `this.waitUntil()`), otherwise
 * the service worker thread may be killed prior to your work completing.
 */
export const doneWaiting = async (handler: StrategyHandler): Promise<void> => {
  let promise: Promise<any> | undefined;
  while ((promise = handler.extendLifetimePromises.shift())) {
    await promise;
  }
};

/**
 * Stops running the strategy and immediately resolves any pending
 * `waitUntil()` promise.
 */
export const destroyHandler = (handler: StrategyHandler): void => {
  handler.handlerDeferred.resolve(null);
};

/**
 * Returns `true` if the strategy has at least one plugin with the given
 * callback.
 *
 * @param name The name of the callback to check for.
 * @returns
 */
export const hasCallback = <C extends keyof StrategyPlugin>(handler: StrategyHandler, name: C): boolean => {
  for (const plugin of handler.strategy.plugins) {
    if (name in plugin) {
      return true;
    }
  }
  return false;
};

/**
 * Runs all plugin callbacks matching the given name, in order, passing the
 * given param object as the only argument.
 *
 * Note: since this method runs all plugins, it's not suitable for cases
 * where the return value of a callback needs to be applied prior to calling
 * the next callback. See {@linkcode iterateCallbacks} for how to handle that case.
 *
 * @param name The name of the callback to run within each plugin.
 * @param param The object to pass as the first (and only) param when executing each callback. This object will be merged with the
 * current plugin state prior to callback execution.
 */
export const runCallbacks = async <C extends keyof NonNullable<StrategyPlugin>>(
  handler: StrategyHandler,
  name: C,
  param: Omit<StrategyPluginCallbackParam[C], "state">,
): Promise<void> => {
  for (const callback of iterateCallbacks(handler, name)) {
    // TODO(philipwalton): not sure why `any` is needed. It seems like
    // this should work with `as StrategyPluginCallbackParam[C]`.
    await callback(param as any);
  }
};

/**
 * Accepts a callback name and returns an iterable of matching plugin callbacks.
 *
 * @param name The name fo the callback to run
 * @returns
 */
export function* iterateCallbacks<C extends keyof StrategyPlugin>(handler: StrategyHandler, name: C): Generator<NonNullable<StrategyPlugin[C]>> {
  for (const plugin of handler.strategy.plugins) {
    if (typeof plugin[name] === "function") {
      const state = handler.pluginStateMap.get(plugin);
      const statefulCallback = (param: Omit<StrategyPluginCallbackParam[C], "state">) => {
        const statefulParam = { ...param, state };

        // TODO(philipwalton): not sure why `any` is needed. It seems like
        // this should work with `as WorkboxPluginCallbackParam[C]`.
        return plugin[name]!(statefulParam as any);
      };
      yield statefulCallback as NonNullable<StrategyPlugin[C]>;
    }
  }
}

/**
 * This method checks if the navigation preload `Response` is available.
 *
 * @param request
 * @param event
 * @returns
 */
export const getPreloadResponse = async (handler: StrategyHandler): Promise<Response | undefined> => {
  if (handler.event instanceof FetchEvent && handler.event.request.mode === "navigate" && "preloadResponse" in handler.event) {
    try {
      const possiblePreloadResponse = (await handler.event.preloadResponse) as Response | undefined;
      if (possiblePreloadResponse) {
        if (process.env.NODE_ENV !== "production") {
          logger.log(`Using a preloaded navigation response for '${getFriendlyURL(handler.event.request.url)}'`);
        }
        return possiblePreloadResponse;
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        logger.error(error);
      }
      return undefined;
    }
  }
  return undefined;
};

/**
 * This method will call `cacheWillUpdate` on the available plugins (or use
 * status === 200) to determine if the response is safe and valid to cache.
 *
 * @param response
 * @returns
 * @private
 */
const ensureResponseSafeToCache = async (handler: StrategyHandler, response: Response): Promise<Response | undefined> => {
  let responseToCache: Response | undefined = response;
  let pluginsUsed = false;

  for (const callback of iterateCallbacks(handler, "cacheWillUpdate")) {
    responseToCache =
      (await callback({
        request: handler.request,
        response: responseToCache,
        event: handler.event,
      })) || undefined;
    pluginsUsed = true;

    if (!responseToCache) {
      break;
    }
  }

  if (!pluginsUsed) {
    if (responseToCache && responseToCache.status !== 200) {
      if (process.env.NODE_ENV !== "production") {
        if (responseToCache.status === 0) {
          logger.warn(
            `The response for '${handler.request.url}' is an opaque response. The caching strategy that you're using will not cache opaque responses by default.`,
          );
        } else {
          logger.debug(`The response for '${handler.request.url}' returned a status code of '${response.status}' and won't be cached as a result.`);
        }
      }
      responseToCache = undefined;
    }
  }

  return responseToCache;
};
