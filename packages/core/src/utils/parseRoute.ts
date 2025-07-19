import type { HTTPMethod } from "#lib/constants.js";
import { RegExpRoute, Route } from "#lib/route.js";
import type { RouteHandler, RouteMatchCallback } from "#lib/types.js";
import { logger } from "./logger.js";
import { SerwistError } from "./SerwistError.js";

/**
 * Parses a `RegExp`, string, or function with a caching strategy into a {@linkcode Route}. This is for
 * when you want to create a {@linkcode Route}, but you don't want to register it just yet: sometimes
 * you want to call {@linkcode Route.setCatchHandler} first, for example.
 *
 * @param capture If the capture param is a {@linkcode Route} object, all other arguments will be ignored.
 * @param handler A callback function that returns a promise resulting in a response.
 * This parameter is required if `capture` is not a {@linkcode Route} object.
 * @param method The HTTP method to match the route against. Defaults to `'GET'`.
 * @returns The generated {@linkcode Route}.
 */
export const parseRoute = (capture: RegExp | string | RouteMatchCallback | Route, handler?: RouteHandler, method?: HTTPMethod): Route => {
  if (typeof capture === "string") {
    const captureUrl = new URL(capture, location.href);

    if (process.env.NODE_ENV !== "production") {
      if (!(capture.startsWith("/") || capture.startsWith("http"))) {
        throw new SerwistError("invalid-string", {
          moduleName: "serwist",
          funcName: "parseRoute",
          paramName: "capture",
        });
      }

      // We want to check if Express-style wildcards are in the pathname only.
      // TODO: Remove this log message in v4.
      const valueToCheck = capture.startsWith("http") ? captureUrl.pathname : capture;

      // See https://github.com/pillarjs/path-to-regexp#parameters
      const wildcards = "[*:?+]";
      if (new RegExp(`${wildcards}`).exec(valueToCheck)) {
        logger.debug(
          `The '$capture' parameter contains an Express-style wildcard character (${wildcards}). Strings are now always interpreted as exact matches; use a RegExp for partial or wildcard matches.`,
        );
      }
    }

    const matchCallback: RouteMatchCallback = ({ url }) => {
      if (process.env.NODE_ENV !== "production") {
        if (url.pathname === captureUrl.pathname && url.origin !== captureUrl.origin) {
          logger.debug(
            `${capture} only partially matches the cross-origin URL ${url.toString()}. This route will only handle cross-origin requests if they match the entire URL.`,
          );
        }
      }

      return url.href === captureUrl.href;
    };

    // If `capture` is a string then `handler` and `method` must be present.
    return new Route(matchCallback, handler!, method);
  }
  if (capture instanceof RegExp) {
    // If `capture` is a `RegExp` then `handler` and `method` must be present.
    return new RegExpRoute(capture, handler!, method);
  }
  if (typeof capture === "function") {
    // If `capture` is a function then `handler` and `method` must be present.
    return new Route(capture, handler!, method);
  }
  if (capture instanceof Route) {
    return capture;
  }
  throw new SerwistError("unsupported-route-type", {
    moduleName: "serwist",
    funcName: "parseRoute",
    paramName: "capture",
  });
};
