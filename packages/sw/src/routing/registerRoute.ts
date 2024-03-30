/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteHandler, RouteMatchCallback } from "@serwist/core";

import { Route } from "./Route.js";
import type { HTTPMethod } from "./utils/constants.js";
import { getOrCreateDefaultRouter } from "./utils/getOrCreateDefaultRouter.js";
import { parseRoute } from "./utils/parseRoute.js";

/**
 * Registers a RegExp, string, or function with a caching
 * strategy to a singleton Router instance.
 *
 * @param capture If the capture param is a `Route`, all other arguments will be ignored.
 * @param handler A callback function that returns a Promise resulting in a Response.
 * This parameter is required if `capture` is not a `Route` object.
 * @param method The HTTP method to match the Route against. Defaults to GET.
 * @returns The generated `Route`.
 */
export const registerRoute = (capture: RegExp | string | RouteMatchCallback | Route, handler?: RouteHandler, method?: HTTPMethod): Route => {
  const route = parseRoute(capture, handler, method);

  const defaultRouter = getOrCreateDefaultRouter();
  defaultRouter.registerRoute(route);

  return route;
};