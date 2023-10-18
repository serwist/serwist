/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteHandler } from "@serwist/core";

import { getOrCreateDefaultRouter } from "./utils/getOrCreateDefaultRouter.js";

/**
 * If a Route throws an error while handling a request, this `handler`
 * will be called and given a chance to provide a response.
 *
 * @param handler A callback function that returns a Promise resulting in a Response.
 */
function setCatchHandler(handler: RouteHandler): void {
  const defaultRouter = getOrCreateDefaultRouter();
  defaultRouter.setCatchHandler(handler);
}

export { setCatchHandler };
