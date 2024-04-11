/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { registerRoute } from "../routing/registerRoute.js";
import { PrecacheRoute } from "./PrecacheRoute.js";
import { getSingletonPrecacheController } from "./singletonPrecacheController.js";
import type { PrecacheRouteOptions } from "./types.js";

/**
 * Add a `fetch` listener to the service worker that will
 * respond to
 * [network requests](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests)
 * with precached assets.
 *
 * Requests for assets that aren't precached, the `FetchEvent` will not be
 * responded to, allowing the event to fall through to other `fetch` event
 * listeners.
 *
 * @param options See the `@serwist/sw/precaching.PrecacheRoute` options.
 */
export const addRoute = (options?: PrecacheRouteOptions): void => {
  const precacheRoute = new PrecacheRoute(getSingletonPrecacheController(), options);
  registerRoute(precacheRoute);
};
