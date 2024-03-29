import type { RouteHandler, RouteMatchCallback } from "@serwist/core";
import { SerwistError, logger } from "@serwist/core/internal";

import { RegExpRoute } from "../RegExpRoute.js";
import { Route } from "../Route.js";
import type { HTTPMethod } from "./constants.js";

export const parseRoute = (capture: RegExp | string | RouteMatchCallback | Route, handler?: RouteHandler, method?: HTTPMethod): Route => {
  let route: Route;

  if (typeof capture === "string") {
    const captureUrl = new URL(capture, location.href);

    if (process.env.NODE_ENV !== "production") {
      if (!(capture.startsWith("/") || capture.startsWith("http"))) {
        throw new SerwistError("invalid-string", {
          moduleName: "@serwist/routing",
          funcName: "registerRoute",
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
    route = new Route(matchCallback, handler!, method);
  } else if (capture instanceof RegExp) {
    // If `capture` is a `RegExp` then `handler` and `method` must be present.
    route = new RegExpRoute(capture, handler!, method);
  } else if (typeof capture === "function") {
    // If `capture` is a function then `handler` and `method` must be present.
    route = new Route(capture, handler!, method);
  } else if (capture instanceof Route) {
    route = capture;
  } else {
    throw new SerwistError("unsupported-route-type", {
      moduleName: "@serwist/routing",
      funcName: "registerRoute",
      paramName: "capture",
    });
  }

  return route;
};
