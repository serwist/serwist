/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
export type PromiseOrNot<T> = T | Promise<T>;

export interface MapLikeObject {
  [key: string]: any;
}

/**
 * Using a plain `MapLikeObject` for now, but could extend/restrict this
 * in the future.
 */
export type PluginState = MapLikeObject;

/**
 * Options passed to a `RouteMatchCallback` function.
 */
export interface RouteMatchCallbackOptions {
  event: ExtendableEvent;
  request: Request;
  sameOrigin: boolean;
  url: URL;
}

/**
 * The "match" callback is used to determine if a `Route` should apply for a
 * particular URL and request. When matching occurs in response to a fetch
 * event from the client, the `event` object is also supplied. However, since
 * the match callback can be invoked outside of a fetch event, matching logic
 * should not assume the `event` object will always be available.
 * If the match callback returns a truthy value, the matching route's
 * `RouteHandlerCallback` will be invoked immediately. If the value returned
 * is a non-empty array or object, that value will be set on the handler's
 * `options.params` argument.
 */
export type RouteMatchCallback = (options: RouteMatchCallbackOptions) => any;

/**
 * Options passed to a `RouteHandlerCallback` function.
 */
export interface RouteHandlerCallbackOptions {
  /**
   * The event associated with the request.
   */
  event: ExtendableEvent;
  /**
   * A request to run this strategy for.
   */
  request: Request;
  url: URL;
  /**
   * The return value from `@serwist/sw/routing`'s `matchCallback` (if applicable).
   */
  params?: string[] | MapLikeObject;
}
/**
 * Options passed to a `ManualHandlerCallback` function.
 */
export interface ManualHandlerCallbackOptions {
  /**
   * The event associated with the request.
   */
  event: ExtendableEvent;
  /**
   * A request to run this strategy for.
   */
  request: Request | string;
  url?: never;
  /**
   * The return value from `@serwist/sw/routing`'s `matchCallback` (if applicable).
   */
  params?: never;
}

export type HandlerCallbackOptions = RouteHandlerCallbackOptions | ManualHandlerCallbackOptions;

/**
 * The "handler" callback is invoked whenever a `Router` matches a URL/Request
 * to a `Route` via its `RouteMatchCallback`. This handler callback should
 * return a `Promise` that resolves with a `Response`.
 *
 * If a non-empty array or object is returned by the `RouteMatchCallback` it
 * will be passed in as this handler's `options.params` argument.
 */
export type RouteHandlerCallback = (options: RouteHandlerCallbackOptions) => Promise<Response>;

/**
 * The "handler" callback is invoked whenever a `Router` matches a URL/Request
 * to a `Route` via its `RouteMatchCallback`. This handler callback should
 * return a `Promise` that resolves with a `Response`.
 *
 * If a non-empty array or object is returned by the `RouteMatchCallback` it
 * will be passed in as this handler's `options.params` argument.
 */
export type ManualHandlerCallback = (options: ManualHandlerCallbackOptions) => Promise<Response>;

/**
 * An object with a `handle` method of type `RouteHandlerCallback`.
 *
 * A `Route` object can be created with either an `RouteHandlerCallback`
 * function or this `RouteHandler` object. The benefit of the `RouteHandler`
 * is it can be extended (as is done by the `@serwist/sw/strategies` package).
 */
export interface RouteHandlerObject {
  handle: RouteHandlerCallback;
}

/**
 * Either a `RouteHandlerCallback` or a `RouteHandlerObject`.
 * Most APIs in `@serwist/sw/routing` that accept route handlers take either.
 */
export type RouteHandler = RouteHandlerCallback | RouteHandlerObject;

export interface HandlerWillStartCallbackParam {
  request: Request;
  event: ExtendableEvent;
  state?: PluginState;
}

export type HandlerWillStartCallback = (param: HandlerWillStartCallbackParam) => Promise<any>;

export interface CacheDidUpdateCallbackParam {
  /**
   * Name of the cache the responses belong to. This is included in the
   * broadcast message.
   */
  cacheName: string;
  /**
   * Possibly updated response to compare.
   */
  newResponse: Response;
  /**
   * The `Request` object for the cached entry.
   */
  request: Request;
  /**
   * The event that triggered this possible cache update.
   */
  event: ExtendableEvent;
  /**
   * Cached response to compare.
   */
  oldResponse?: Response | null;
  state?: PluginState;
}

export type CacheDidUpdateCallback = (param: CacheDidUpdateCallbackParam) => PromiseOrNot<any>;

export interface CacheKeyWillBeUsedCallbackParam {
  mode: string;
  request: Request;
  event: ExtendableEvent;
  params?: any;
  state?: PluginState;
}

export type CacheKeyWillBeUsedCallback = (param: CacheKeyWillBeUsedCallbackParam) => PromiseOrNot<Request | string>;

export interface CacheWillUpdateCallbackParam {
  request: Request;
  response: Response;
  event: ExtendableEvent;
  state?: PluginState;
}

export type CacheWillUpdateCallback = (param: CacheWillUpdateCallbackParam) => PromiseOrNot<any>;

export interface CachedResponseWillBeUsedCallbackParam {
  /**
   * Name of the cache the response is in.
   */
  cacheName: string;
  /**
   * The original request, which may or may not
   * contain a Range: header.
   */
  request: Request;
  /**
   * The complete cached `Response` object that's been read
   * from a cache and whose freshness should be checked.
   */
  cachedResponse?: Response;
  event: ExtendableEvent;
  matchOptions?: CacheQueryOptions;
  state?: PluginState;
}

export type CachedResponseWillBeUsedCallback = (param: CachedResponseWillBeUsedCallbackParam) => PromiseOrNot<any>;

export interface FetchDidFailCallbackParam {
  error: Error;
  originalRequest: Request;
  request: Request;
  event: ExtendableEvent;
  state?: PluginState;
}

export type FetchDidFailCallback = (param: FetchDidFailCallbackParam) => PromiseOrNot<any>;

export interface FetchDidSucceedCallbackParam {
  request: Request;
  response: Response;
  event: ExtendableEvent;
  state?: PluginState;
}

export type FetchDidSucceedCallback = (param: FetchDidSucceedCallbackParam) => PromiseOrNot<Response>;

export interface RequestWillFetchCallbackParam {
  request: Request;
  event: ExtendableEvent;
  state?: PluginState;
}

export type RequestWillFetchCallback = (param: RequestWillFetchCallbackParam) => PromiseOrNot<Request>;

export interface HandlerWillRespondCallbackParam {
  request: Request;
  response: Response;
  event: ExtendableEvent;
  state?: PluginState;
}

export type HandlerWillRespondCallback = (param: HandlerWillRespondCallbackParam) => PromiseOrNot<Response>;

export interface HandlerDidErrorCallbackParam {
  request: Request;
  event: ExtendableEvent;
  error: Error;
  state?: PluginState;
}

export type HandlerDidErrorCallback = (param: HandlerDidErrorCallbackParam) => PromiseOrNot<Response | undefined>;

export interface HandlerDidRespondCallbackParam {
  request: Request;
  event: ExtendableEvent;
  response?: Response;
  state?: PluginState;
}

export type HandlerDidRespondCallback = (param: HandlerDidRespondCallbackParam) => PromiseOrNot<any>;

export interface HandlerDidCompleteCallbackParam {
  request: Request;
  error?: Error;
  event: ExtendableEvent;
  response?: Response;
  state?: PluginState;
}

export type HandlerDidCompleteCallback = (param: HandlerDidCompleteCallbackParam) => PromiseOrNot<any>;

/**
 * An object with optional lifecycle callback properties for the fetch and
 * cache operations.
 */
export declare interface SerwistPlugin {
  cacheDidUpdate?: CacheDidUpdateCallback;
  cachedResponseWillBeUsed?: CachedResponseWillBeUsedCallback;
  cacheKeyWillBeUsed?: CacheKeyWillBeUsedCallback;
  cacheWillUpdate?: CacheWillUpdateCallback;
  fetchDidFail?: FetchDidFailCallback;
  fetchDidSucceed?: FetchDidSucceedCallback;
  handlerDidComplete?: HandlerDidCompleteCallback;
  handlerDidError?: HandlerDidErrorCallback;
  handlerDidRespond?: HandlerDidRespondCallback;
  handlerWillRespond?: HandlerWillRespondCallback;
  handlerWillStart?: HandlerWillStartCallback;
  requestWillFetch?: RequestWillFetchCallback;
}

export interface SerwistPluginCallbackParam {
  cacheDidUpdate: CacheDidUpdateCallbackParam;
  cachedResponseWillBeUsed: CachedResponseWillBeUsedCallbackParam;
  cacheKeyWillBeUsed: CacheKeyWillBeUsedCallbackParam;
  cacheWillUpdate: CacheWillUpdateCallbackParam;
  fetchDidFail: FetchDidFailCallbackParam;
  fetchDidSucceed: FetchDidSucceedCallbackParam;
  handlerDidComplete: HandlerDidCompleteCallbackParam;
  handlerDidError: HandlerDidErrorCallbackParam;
  handlerDidRespond: HandlerDidRespondCallbackParam;
  handlerWillRespond: HandlerWillRespondCallbackParam;
  handlerWillStart: HandlerWillStartCallbackParam;
  requestWillFetch: RequestWillFetchCallbackParam;
}

export interface SerwistGlobalConfig {
  /**
   * Whether Serwist should disable development logging.
   *
   * @default false
   */
  __WB_DISABLE_DEV_LOGS: boolean;
}
