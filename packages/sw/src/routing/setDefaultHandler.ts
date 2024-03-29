/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteHandler } from "@serwist/core";

import { getOrCreateDefaultRouter } from "./utils/getOrCreateDefaultRouter.js";

/**
 * Defines a default `handler` that's called when no routes explicitly
 * match the incoming request.
 *
 * Without a default handler, unmatched requests will go against the
 * network as if there were no service worker present.
 *
 * @param handler A callback function that returns a Promise resulting in a Response.
 */
export const setDefaultHandler = (handler: RouteHandler): void => {
  const defaultRouter = getOrCreateDefaultRouter();
  defaultRouter.setDefaultHandler(handler);
};
