/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteHandlerCallback } from "../types.js";
import type { PrecacheController } from "./PrecacheController.js";
import { getSingletonPrecacheController } from "./singletonPrecacheController.js";

/**
 * Helper function that calls {@linkcode PrecacheController.createHandlerBoundToURL}
 * on the default {@linkcode PrecacheController} instance.
 *
 * If you are creating your own {@linkcode PrecacheController}, then call the
 * {@linkcode PrecacheController.createHandlerBoundToURL} function on that instance
 * instead of using this function.
 *
 * @param url The precached URL which will be used to look up the response.
 * @param fallbackToNetwork Whether to attempt to get the
 * response from the network if there's a precache miss.
 * @return
 * @deprecated
 */
export const createHandlerBoundToURL = (url: string): RouteHandlerCallback => {
  const precacheController = getSingletonPrecacheController();
  return precacheController.createHandlerBoundToURL(url);
};
