import { assert } from "#utils/assert.js";
import { getFriendlyURL } from "#utils/getFriendlyURL.js";
import { logger } from "#utils/logger.js";
import { parseRoute } from "#utils/parseRoute.js";
import { SerwistError } from "#utils/SerwistError.js";
import type { HTTPMethod } from "../constants.js";
import type { Serwist } from "../core.js";
import type { Route } from "../route.js";
import type { RouteHandler, RouteHandlerCallbackOptions, RouteMatchCallback, RouteMatchCallbackOptions } from "../types.js";

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
export const registerCapture = <T extends RegExp | string | RouteMatchCallback | Route>(
  state: Serwist,
  capture: T,
  handler?: T extends Route ? never : RouteHandler,
  method?: T extends Route ? never : HTTPMethod,
): Route => {
  const route = parseRoute(capture, handler, method);
  registerRoute(state, route);
  return route;
};

/**
 * Registers a {@linkcode Route} with the router.
 *
 * @param route The {@linkcode Route} to register.
 */
export const registerRoute = (state: Serwist, route: Route): void => {
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

  if (!state.routes.has(route.method)) {
    state.routes.set(route.method, []);
  }

  // Give precedence to all of the earlier routes by adding this additional
  // route to the end of the array.
  state.routes.get(route.method)!.push(route);
};

/**
 * Unregisters a route from the router.
 *
 * @param route The {@linkcode Route} object to unregister.
 */
export const unregisterRoute = (state: Serwist, route: Route): void => {
  if (!state.routes.has(route.method)) {
    throw new SerwistError("unregister-route-but-not-found-with-method", {
      method: route.method,
    });
  }

  const routeIndex = state.routes.get(route.method)!.indexOf(route);
  if (routeIndex > -1) {
    state.routes.get(route.method)!.splice(routeIndex, 1);
  } else {
    throw new SerwistError("unregister-route-route-not-registered");
  }
};

/**
 * Applies the routing rules to a `FetchEvent` object to get a response from an
 * appropriate route.
 *
 * @param options
 * @returns A promise is returned if a registered route can handle the request.
 * If there is no matching route and there's no default handler, `undefined`
 * is returned.
 */
export const handleRequest = (
  state: Serwist,
  {
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
  },
): Promise<Response> | undefined => {
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
  const { params, route } = findMatchingRoute(state, {
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
  if (!handler && state.defaultHandlerMap.has(method)) {
    if (process.env.NODE_ENV !== "production") {
      debugMessages.push(`Failed to find a matching route. Falling back to the default handler for ${method}.`);
    }
    handler = state.defaultHandlerMap.get(method);
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

  if (responsePromise instanceof Promise && (state.catchHandler || catchHandler)) {
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

      if (state.catchHandler) {
        if (process.env.NODE_ENV !== "production") {
          // Still include URL here as it will be async from the console group
          // and may not make sense without the URL
          logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to global Catch Handler.`);
          logger.error("Error thrown by:", route);
          logger.error(err);
          logger.groupEnd();
        }
        return state.catchHandler.handle({ url, request, event });
      }

      throw err;
    });
  }

  return responsePromise;
};

/**
 * Checks a request and URL (and optionally an event) against the list of
 * registered routes, and if there's a match, returns the corresponding
 * route along with any params generated by the match.
 *
 * @param options
 * @returns An object with `route` and `params` properties. They are populated
 * if a matching route was found or `undefined` otherwise.
 */
export const findMatchingRoute = (
  state: Serwist,
  { url, sameOrigin, request, event }: RouteMatchCallbackOptions,
): {
  route?: Route;
  params?: RouteHandlerCallbackOptions["params"];
} => {
  const routes = state.routes.get(request.method as HTTPMethod) || [];
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
};
