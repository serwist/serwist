/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import "./_version.js";

import { registerRoute } from "@serwist/routing";

import type { PrecacheRouteOptions } from "./_types.js";
import { PrecacheRoute } from "./PrecacheRoute.js";
import { getOrCreatePrecacheController } from "./utils/getOrCreatePrecacheController.js";

/**
 * Add a `fetch` listener to the service worker that will
 * respond to
 * [network requests]{@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests}
 * with precached assets.
 *
 * Requests for assets that aren't precached, the `FetchEvent` will not be
 * responded to, allowing the event to fall through to other `fetch` event
 * listeners.
 *
 * @param options See the {@link workbox-precaching.PrecacheRoute}
 * options.
  */
function addRoute(options?: PrecacheRouteOptions): void {
  const precacheController = getOrCreatePrecacheController();

  const precacheRoute = new PrecacheRoute(precacheController, options);
  registerRoute(precacheRoute);
}

export { addRoute };
