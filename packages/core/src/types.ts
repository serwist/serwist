import type { MaybePromise } from "@serwist/utils";
import type { HTTPMethod } from "./constants.js";
import type { PrecacheStrategyOptions } from "./lib/strategies/PrecacheStrategy.js";
import type { Route } from "./Route.js";
import type { Serwist } from "./Serwist.js";

export type { MaybePromise as PromiseOrNot };

export interface MapLikeObject {
  [key: string]: any;
}

/**
 * Using a plain {@linkcode MapLikeObject} for now, but could extend/restrict this
 * in the future.
 */
export type PluginState = MapLikeObject;

/**
 * Options passed to a {@linkcode RouteMatchCallback} function.
 */
export interface RouteMatchCallbackOptions {
  event: ExtendableEvent;
  request: Request;
  sameOrigin: boolean;
  url: URL;
}

/**
 * The match callback is used to determine if a route should apply for a
 * particular URL and request.
 *
 * When matching occurs in response to a `fetch` event from the client, the `event`
 * object is also supplied. However, since the match callback can be invoked outside
 * of a `fetch` event, matching logic should not assume the `event` object will always
 * be available.
 *
 * If the match callback returns a truthy value, the matching route's
 * handler will be invoked immediately. If the value returned is a non-empty array
 * or object, that value will be the handler's `options.params` argument.
 */
export type RouteMatchCallback = (options: RouteMatchCallbackOptions) => any;

/**
 * Options passed to a {@linkcode RouteHandlerCallback} function.
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
  params?: string[] | MapLikeObject;
}
/**
 * Options passed to a {@linkcode ManualHandlerCallback} function.
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
   * The return value from {@linkcode RouteMatchCallback} (if applicable).
   */
  params?: never;
}

export type HandlerCallbackOptions = RouteHandlerCallbackOptions | ManualHandlerCallbackOptions;

/**
 * The "handler" callback is invoked whenever a request is matched to a
 * {@linkcode Route} via its {@linkcode RouteMatchCallback} This handler
 * callback should return a promise that resolves to a response.
 *
 * If a non-empty array or object is returned by the matcher, it
 * will be passed in as this handler's `options.params` argument.
 */
export type RouteHandlerCallback = (options: RouteHandlerCallbackOptions) => Promise<Response>;

/**
 * The "handler" callback is invoked whenever a request is matched to a
 * {@linkcode Route} via its {@linkcode RouteMatchCallback} This handler
 * callback should return a promise that resolves to a response.
 *
 * If a non-empty array or object is returned by the matcher, it
 * will be passed in as this handler's `options.params` argument.
 */
export type ManualHandlerCallback = (options: ManualHandlerCallbackOptions) => Promise<Response>;

/**
 * An object with a `handle` method of type {@linkcode RouteHandlerCallback}.
 *
 * A {@linkcode Route} object can be created with either an `RouteHandlerCallback`
 * function or this {@linkcode RouteHandler} object.
 */
export interface RouteHandlerObject {
  handle: RouteHandlerCallback;
}

/**
 * Either a {@linkcode RouteHandlerCallback} or a {@linkcode RouteHandlerObject}.
 * Most APIs that accept route handlers take either.
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
   * The possibly updated response.
   */
  newResponse: Response;
  /**
   * The request for the cached entry.
   */
  request: Request;
  /**
   * The event that triggered this possible cache update.
   */
  event: ExtendableEvent;
  /**
   * The previous cached response.
   */
  oldResponse?: Response | null;
  state?: PluginState;
}

export type CacheDidUpdateCallback = (param: CacheDidUpdateCallbackParam) => MaybePromise<any>;

export interface CacheKeyWillBeUsedCallbackParam {
  mode: string;
  request: Request;
  event: ExtendableEvent;
  params?: any;
  state?: PluginState;
}

export type CacheKeyWillBeUsedCallback = (param: CacheKeyWillBeUsedCallbackParam) => MaybePromise<Request | string>;

export interface CacheWillUpdateCallbackParam {
  request: Request;
  response: Response;
  event: ExtendableEvent;
  state?: PluginState;
}

export type CacheWillUpdateCallback = (param: CacheWillUpdateCallbackParam) => MaybePromise<any>;

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

export type CachedResponseWillBeUsedCallback = (param: CachedResponseWillBeUsedCallbackParam) => MaybePromise<any>;

export interface FetchDidFailCallbackParam {
  error: Error;
  originalRequest: Request;
  request: Request;
  event: ExtendableEvent;
  state?: PluginState;
}

export type FetchDidFailCallback = (param: FetchDidFailCallbackParam) => MaybePromise<any>;

export interface FetchDidSucceedCallbackParam {
  request: Request;
  response: Response;
  event: ExtendableEvent;
  state?: PluginState;
}

export type FetchDidSucceedCallback = (param: FetchDidSucceedCallbackParam) => MaybePromise<Response>;

export interface RequestWillFetchCallbackParam {
  request: Request;
  event: ExtendableEvent;
  state?: PluginState;
}

export type RequestWillFetchCallback = (param: RequestWillFetchCallbackParam) => MaybePromise<Request>;

export interface HandlerWillRespondCallbackParam {
  request: Request;
  response: Response;
  event: ExtendableEvent;
  state?: PluginState;
}

export type HandlerWillRespondCallback = (param: HandlerWillRespondCallbackParam) => MaybePromise<Response>;

export interface HandlerDidErrorCallbackParam {
  request: Request;
  event: ExtendableEvent;
  error: Error;
  state?: PluginState;
}

export type HandlerDidErrorCallback = (param: HandlerDidErrorCallbackParam) => MaybePromise<Response | undefined>;

export interface HandlerDidRespondCallbackParam {
  request: Request;
  event: ExtendableEvent;
  response?: Response;
  state?: PluginState;
}

export type HandlerDidRespondCallback = (param: HandlerDidRespondCallbackParam) => MaybePromise<any>;

export interface HandlerDidCompleteCallbackParam {
  request: Request;
  error?: Error;
  event: ExtendableEvent;
  response?: Response;
  state?: PluginState;
}

export type HandlerDidCompleteCallback = (param: HandlerDidCompleteCallbackParam) => MaybePromise<any>;

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

export interface RuntimeCaching {
  /**
   * The HTTP method to match against. The default value of `'GET'` is normally
   * sufficient, unless you explicitly need to match `'POST'`, `'PUT'`, or
   * another type of request.
   * @default "GET"
   */
  method?: HTTPMethod;
  /**
   * The match callback determines whether the configured handler will be used to
   * generate a response for any request that doesn't match one of the precached
   * URLs. If multiple routes are defined, then the first one to match the request
   * will be the one that responds.
   *
   * This value directly maps to the first parameter passed to
   * {@linkcode Serwist.registerRoute}. It's recommended to use a
   * {@linkcode RouteMatchCallback} function for greatest flexibility.
   */
  matcher: RegExp | string | RouteMatchCallback;
  /**
   * This determines how the runtime route will generate a response. It
   * can be a {@linkcode RouteHandler} callback function with custom
   * response logic.
   */
  handler: RouteHandler;
}

export interface InstallResult {
  updatedURLs: string[];
  notUpdatedURLs: string[];
}

export interface CleanupResult {
  deletedCacheRequests: string[];
}

export declare interface PrecacheEntry {
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

export interface PrecacheOptions extends PrecacheStrategyOptions, PrecacheRouteOptions {
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

export type UrlManipulation = ({ url }: { url: URL }) => URL[];
