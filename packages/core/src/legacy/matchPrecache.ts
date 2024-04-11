/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { getSingletonPrecacheController } from "./singletonPrecacheController.js";

/**
 * Helper function that calls `PrecacheController#matchPrecache`
 * on the default `PrecacheController` instance.
 *
 * If you are creating your own `PrecacheController`, then call
 * `PrecacheController#matchPrecache` on that instance,
 * instead of using this function.
 *
 * @param request The key (without revisioning parameters)
 * to look up in the precache.
 * @returns
 * @deprecated
 */
export const matchPrecache = (request: string | Request): Promise<Response | undefined> => {
  return getSingletonPrecacheController().matchPrecache(request);
};
