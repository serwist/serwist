/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { HTTPMethod } from "../constants.js";
import type { Route } from "../Route.js";
import type { RouteHandler, RouteMatchCallback } from "../types.js";
import type { Router } from "./Router.js";
import { getSingletonRouter } from "./singletonRouter.js";
import type { unregisterRoute } from "./unregisterRoute.js";

/**
 * Registers a `RegExp`, string, or function with a caching
 * strategy to a singleton {@linkcode Router} instance.
 *
 * @param capture If the capture param is a {@linkcode Route}, all other arguments will be ignored.
 * @param handler A callback function that returns a promise resulting in a response.
 * This parameter is required if `capture` is not a {@linkcode Route} object.
 * @param method The HTTP method to match the route against. Defaults to `'GET'`.
 * @returns The generated {@linkcode Route} object, which can then be provided to {@linkcode unregisterRoute} if needed.
 * @deprecated
 */
export const registerRoute = (capture: RegExp | string | RouteMatchCallback | Route, handler?: RouteHandler, method?: HTTPMethod): Route => {
  return getSingletonRouter().registerCapture(capture, handler, method);
};
