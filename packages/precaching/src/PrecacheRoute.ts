/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import "./_version.js";

import { getFriendlyURL,logger } from "@serwist/core/private";
import type {
  RouteMatchCallback,
  RouteMatchCallbackOptions,
} from "@serwist/core/types";
import { Route } from "@serwist/routing";

import type { PrecacheRouteOptions } from "./_types.js";
import type { PrecacheController } from "./PrecacheController.js";
import { generateURLVariations } from "./utils/generateURLVariations.js";

/**
 * A subclass of `@serwist/routing.Route` that takes a
 * `@serwist/precaching.PrecacheController`
 * instance and uses it to match incoming requests and handle fetching
 * responses from the precache.
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
