/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { Route } from "../Route.js";
import type { HTTPMethod } from "../constants.js";
import { defaultMethod } from "../constants.js";
import type { RouteHandler, RouteHandlerCallbackOptions, RouteHandlerObject, RouteMatchCallback, RouteMatchCallbackOptions } from "../types.js";
import { SerwistError } from "../utils/SerwistError.js";
import { assert } from "../utils/assert.js";
import { getFriendlyURL } from "../utils/getFriendlyURL.js";
import { logger } from "../utils/logger.js";
import { normalizeHandler } from "../utils/normalizeHandler.js";
import { parseRoute } from "../utils/parseRoute.js";

declare const self: ServiceWorkerGlobalScope;

type RequestArgs = string | [string, RequestInit?];

interface CacheURLsMessageData {
  type: string;
  payload: {
    urlsToCache: RequestArgs[];
  };
}

/**
 * `Router` can be used to process a `FetchEvent` using one or more `Route`(s), responding with a `Response`
 * if a matching route exists.
 *
 * If no `Route` matches given a `Request`, the `Router` will use the default handler if one is defined.
 *
 * Should the matching Route throw an error, the Router will use the catch handler if one is defined to
 * gracefully deal with issues and respond with a `Request`.
 *
 * If a `Request` matches multiple routes, the earliest registered route will be used to respond to the `Request`.
 * @deprecated
 */
export class Router {
  private readonly _routes: Map<HTTPMethod, Route[]>;
  private readonly _defaultHandlerMap: Map<HTTPMethod, RouteHandlerObject>;
  private _fetchListenerHandler: ((ev: FetchEvent) => void) | null = null;
  private _cacheListenerHandler: ((ev: ExtendableMessageEvent) => void) | null = null;
  private _catchHandler?: RouteHandlerObject;

  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = new Map();
    this._defaultHandlerMap = new Map();
  }

  /**
   * @returns routes A `Map` of HTTP method name (`'GET'`, etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */
  get routes(): Map<HTTPMethod, Route[]> {
    return this._routes;
  }

  /**
   * Adds a `fetch` event listener to respond to events when a `Route` matches
   * the event's request. Effectively no-op if `addFEtchListener` has been
   * called, but `removeFetchListener` has not.
   */
  addFetchListener(): void {
    if (!this._fetchListenerHandler) {
      this._fetchListenerHandler = (event) => {
        const { request } = event;
        const responsePromise = this.handleRequest({ request, event });
        if (responsePromise) {
          event.respondWith(responsePromise);
        }
      };
      self.addEventListener("fetch", this._fetchListenerHandler);
    }
  }

  /**
   * Removes `fetch` event listener added by `addFetchListener`.
   * Effectively no-op if either `addFetchListener` has not been called or,
   * if it has, so has `removeFetchListener`.
   */
  removeFetchListener(): void {
    if (this._fetchListenerHandler) {
      self.removeEventListener("fetch", this._fetchListenerHandler);
      this._fetchListenerHandler = null;
    }
  }

  /**
   * Adds a `message` event listener for URLs to cache from the window.
   * This is useful to cache resources loaded on the page prior to when the
   * service worker started controlling it. Effectively no-op if `addCacheListener`
   * has been called, but `removeCacheListener` hasn't.
   *
   * The format of the message data sent from the window should be as follows.
   * Where the `urlsToCache` array may consist of URL strings or an array of
   * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
   *
   * ```
   * {
   *   type: 'CACHE_URLS',
   *   payload: {
   *     urlsToCache: [
   *       './script1.js',
   *       './script2.js',
   *       ['./script3.js', {mode: 'no-cors'}],
   *     ],
   *   },
   * }
   * ```
   */
  addCacheListener(): void {
    if (!this._cacheListenerHandler) {
      this._cacheListenerHandler = (event) => {
        if (event.data && event.data.type === "CACHE_URLS") {
          const { payload }: CacheURLsMessageData = event.data;

          if (process.env.NODE_ENV !== "production") {
            logger.debug("Caching URLs from the window", payload.urlsToCache);
          }

          const requestPromises = Promise.all(
            payload.urlsToCache.map((entry: string | [string, RequestInit?]) => {
              if (typeof entry === "string") {
                entry = [entry];
              }

              const request = new Request(...entry);
              return this.handleRequest({ request, event });
            }),
          );

          event.waitUntil(requestPromises);

          // If a MessageChannel was used, reply to the message on success.
          if (event.ports?.[0]) {
            void requestPromises.then(() => event.ports[0].postMessage(true));
          }
        }
      };
      self.addEventListener("message", this._cacheListenerHandler);
    }
  }

  /**
   * Removes the `message` event listener added by `addCacheListener`.
   * Effectively no-op if either `addCacheListener` has not been called or,
   * if it has, so has `removeCacheListener`.
   */
  removeCacheListener(): void {
    if (this._cacheListenerHandler) {
      self.removeEventListener("message", this._cacheListenerHandler);
    }
  }

  /**
   * Apply the routing rules to a `FetchEvent` object to get a `Response` from an
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
        moduleName: "serwist/legacy",
        className: "Router",
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
   * strategy to the `Router`.
   *
   * @param capture If the capture param is a `Route`, all other arguments will be ignored.
   * @param handler A callback function that returns a `Promise` resulting in a `Response`.
   * This parameter is required if `capture` is not a `Route` object.
   * @param method The HTTP method to match the Route against. Defaults to `'GET'`.
   * @returns The generated `Route`.
   */
  registerCapture(capture: RegExp | string | RouteMatchCallback | Route, handler?: RouteHandler, method?: HTTPMethod): Route {
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
        moduleName: "serwist/legacy",
        className: "Router",
        funcName: "registerRoute",
        paramName: "route",
      });

      assert!.hasMethod(route, "match", {
        moduleName: "serwist/legacy",
        className: "Router",
        funcName: "registerRoute",
        paramName: "route",
      });

      assert!.isType(route.handler, "object", {
        moduleName: "serwist/legacy",
        className: "Router",
        funcName: "registerRoute",
        paramName: "route",
      });

      assert!.hasMethod(route.handler, "handle", {
        moduleName: "serwist/legacy",
        className: "Router",
        funcName: "registerRoute",
        paramName: "route.handler",
      });

      assert!.isType(route.method, "string", {
        moduleName: "serwist/legacy",
        className: "Router",
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
   * Unregisters a `Route` with the `Router`.
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
}
