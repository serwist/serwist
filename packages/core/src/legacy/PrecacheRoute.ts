/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { Route } from "../Route.js";
import type { RouteMatchCallback, RouteMatchCallbackOptions } from "../types.js";
import type { PrecacheRouteOptions } from "../types.js";
import { generateURLVariations } from "../utils/generateURLVariations.js";
import { getFriendlyURL } from "../utils/getFriendlyURL.js";
import { logger } from "../utils/logger.js";
import type { PrecacheController } from "./PrecacheController.js";

/**
 * A subclass of `serwist.Route` that takes a `serwist/legacy.PrecacheController`
 * instance and uses it to match incoming requests and handle fetching
 * responses from the precache.
 * @deprecated
 */
export class PrecacheRoute extends Route {
  /**
   * @param precacheController A `PrecacheController`
   * instance used to both match requests and respond to fetch events.
   * @param options Options to control how requests are matched
   * against the list of precached URLs.
   */
  constructor(precacheController: PrecacheController, options?: PrecacheRouteOptions) {
    const match: RouteMatchCallback = ({ request }: RouteMatchCallbackOptions) => {
      const urlsToCacheKeys = precacheController.getURLsToCacheKeys();
      for (const possibleURL of generateURLVariations(request.url, options)) {
        const cacheKey = urlsToCacheKeys.get(possibleURL);
        if (cacheKey) {
          const integrity = precacheController.getIntegrityForCacheKey(cacheKey);
          return { cacheKey, integrity };
        }
      }
      if (process.env.NODE_ENV !== "production") {
        logger.debug(`Precaching did not find a match for ${getFriendlyURL(request.url)}`);
      }
      return;
    };

    super(match, precacheController.strategy);
  }
}
