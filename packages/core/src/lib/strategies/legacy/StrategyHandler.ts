/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { Route } from "#lib/route.js";
import type { HandlerCallbackOptions, MapLikeObject, StrategyPlugin, StrategyPluginCallbackParam } from "#lib/types.js";
import type { StrategyHandler as StrategyHandlerStruct } from "../handler.js";
import {
  cacheMatch,
  cachePut,
  createHandler,
  destroyHandler,
  doneWaiting,
  fetch,
  fetchAndCachePut,
  getCacheKey,
  getPreloadResponse,
  hasCallback,
  iterateCallbacks,
  runCallbacks,
  waitUntil,
} from "../handler.js";
import { Strategy } from "./Strategy.js";

/**
 * A class created every time a {@linkcode Strategy} instance calls {@linkcode Strategy.handle} or
 * {@linkcode Strategy.handleAll} that wraps all fetch and cache actions around plugin callbacks
 * and keeps track of when the strategy is "done" (i.e. when all added `event.waitUntil()` promises
 * have resolved).
 */
export class StrategyHandler {
  /**
   * The event associated with this request.
   */
  get event(): ExtendableEvent {
    return this.instance.event;
  }
  set event(value: ExtendableEvent) {
    this.instance.event = value;
  }
  /**
   * The request the strategy is processing (passed to the strategy's
   * `handle()` or `handleAll()` method).
   */
  get request(): Request {
    return this.instance.request;
  }
  set request(value: Request) {
    this.instance.request = value;
  }
  /**
   * A `URL` instance of `request.url` (if passed to the strategy's
   * `handle()` or `handleAll()` method).
   * Note: the `url` param will be present if the strategy is invoked
   * from a {@linkcode Route} object.
   */
  get url(): URL | undefined {
    return this.instance.url;
  }
  set url(value: URL | undefined) {
    this.instance.url = value;
  }
  /**
   * Some additional params (if passed to the strategy's
   * `handle()` or `handleAll()` method).
   *
   * Note: the `params` param will be present if the strategy is invoked
   * from a {@linkcode Route} object and that route's matcher returned a truthy
   * value (it will be that value).
   */
  get params(): string[] | MapLikeObject | undefined {
    return this.instance.params;
  }
  set params(value: string[] | MapLikeObject | undefined) {
    this.instance.params = value;
  }

  private instance: StrategyHandlerStruct;

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
    ...[strategyOrInstance, options]:
      | [StrategyHandlerStruct]
      | [
          Strategy,
          options?: HandlerCallbackOptions & {
            request: HandlerCallbackOptions["request"] & Request;
          },
        ]
  ) {
    if (strategyOrInstance instanceof Strategy) {
      this.instance = createHandler(strategyOrInstance, options!);
    } else {
      this.instance = strategyOrInstance;
    }
  }

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
  async fetch(input: RequestInfo): Promise<Response> {
    return fetch(this.instance, input);
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
    return fetchAndCachePut(this.instance, input);
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
    return cacheMatch(this.instance, key);
  }

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
  async cachePut(key: RequestInfo, response: Response): Promise<boolean> {
    return cachePut(this.instance, key, response);
  }

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
  async getCacheKey(request: Request, mode: "read" | "write"): Promise<Request> {
    return getCacheKey(this.instance, request, mode);
  }

  /**
   * Returns `true` if the strategy has at least one plugin with the given
   * callback.
   *
   * @param name The name of the callback to check for.
   * @returns
   */
  hasCallback<C extends keyof StrategyPlugin>(name: C): boolean {
    return hasCallback(this.instance, name);
  }

  /**
   * Runs all plugin callbacks matching the given name, in order, passing the
   * given param object as the only argument.
   *
   * Note: since this method runs all plugins, it's not suitable for cases
   * where the return value of a callback needs to be applied prior to calling
   * the next callback. See {@linkcode StrategyHandler.iterateCallbacks} for how to handle that case.
   *
   * @param name The name of the callback to run within each plugin.
   * @param param The object to pass as the first (and only) param when executing each callback. This object will be merged with the
   * current plugin state prior to callback execution.
   */
  async runCallbacks<C extends keyof NonNullable<StrategyPlugin>>(name: C, param: Omit<StrategyPluginCallbackParam[C], "state">): Promise<void> {
    return runCallbacks(this.instance, name, param);
  }

  /**
   * Accepts a callback name and returns an iterable of matching plugin callbacks.
   *
   * @param name The name fo the callback to run
   * @returns
   */
  *iterateCallbacks<C extends keyof StrategyPlugin>(name: C): Generator<NonNullable<StrategyPlugin[C]>> {
    for (const cb of iterateCallbacks(this.instance, name)) {
      yield cb;
    }
  }

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
  waitUntil<T>(promise: Promise<T>): Promise<T> {
    return waitUntil(this.instance, promise);
  }

  /**
   * Returns a promise that resolves once all promises passed to
   * `this.waitUntil()` have settled.
   *
   * Note: any work done after `doneWaiting()` settles should be manually
   * passed to an event's `waitUntil()` method (not `this.waitUntil()`), otherwise
   * the service worker thread may be killed prior to your work completing.
   */
  doneWaiting(): Promise<void> {
    return doneWaiting(this.instance);
  }

  /**
   * Stops running the strategy and immediately resolves any pending
   * `waitUntil()` promise.
   */
  destroy(): void {
    destroyHandler(this.instance);
  }

  /**
   * This method checks if the navigation preload `Response` is available.
   *
   * @param request
   * @param event
   * @returns
   */
  getPreloadResponse(): Promise<Response | undefined> {
    return getPreloadResponse(this.instance);
  }
}
