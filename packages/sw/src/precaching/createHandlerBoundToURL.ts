/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteHandlerCallback } from "@serwist/core";

import { getOrCreatePrecacheController } from "./utils/getOrCreatePrecacheController.js";

/**
 * Helper function that calls `PrecacheController#createHandlerBoundToURL`
 * on the default `PrecacheController` instance.
 *
 * If you are creating your own `PrecacheController`, then call the
 * `PrecacheController#createHandlerBoundToURL` on that instance,
 * instead of using this function.
 *
 * @param url The precached URL which will be used to lookup the
 * `Response`.
 * @param fallbackToNetwork Whether to attempt to get the
 * response from the network if there's a precache miss.
 * @return
 */
export const createHandlerBoundToURL = (url: string): RouteHandlerCallback => {
  const precacheController = getOrCreatePrecacheController();
  return precacheController.createHandlerBoundToURL(url);
};
