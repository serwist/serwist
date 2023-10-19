/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { logger, getFriendlyURL } from "@serwist/core/private";
import {
  RouteMatchCallback,
  RouteMatchCallbackOptions,
} from "@serwist/core/types";
import { Route } from "@serwist/routing";

import { PrecacheRouteOptions } from "./_types.js";
import { PrecacheController } from "./PrecacheController.js";
import { generateURLVariations } from "./utils/generateURLVariations.js";

import "./_version.js";

/**
 * A subclass of {@link workbox-routing.Route} that takes a
 * {@link workbox-precaching.PrecacheController}
 * instance and uses it to match incoming requests and handle fetching
 * responses from the precache.
 *
 * @memberof workbox-precaching
 */
class PrecacheRoute extends Route {
  /**
   * @param precacheController A `PrecacheController`
   * instance used to both match requests and respond to fetch events.
   * @param options Options to control how requests are matched
   * against the list of precached URLs.
   */
  constructor(
    precacheController: PrecacheController,
    options?: PrecacheRouteOptions
  ) {
    const match: RouteMatchCallback = ({
      request,
    }: RouteMatchCallbackOptions) => {
      const urlsToCacheKeys = precacheController.getURLsToCacheKeys();
      for (const possibleURL of generateURLVariations(request.url, options)) {
        const cacheKey = urlsToCacheKeys.get(possibleURL);
        if (cacheKey) {
          const integrity =
            precacheController.getIntegrityForCacheKey(cacheKey);
          return { cacheKey, integrity };
        }
      }
      if (process.env.NODE_ENV !== "production") {
        logger.debug(
          `Precaching did not find a match for ` + getFriendlyURL(request.url)
        );
      }
      return;
    };

    super(match, precacheController.strategy);
  }
}

export { PrecacheRoute };
