/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { Route } from "../../Route.js";
import type { RouteMatchCallback, RouteMatchCallbackOptions } from "../../types.js";
import { generateURLVariations } from "../../utils/generateURLVariations.js";
import { getFriendlyURL } from "../../utils/getFriendlyURL.js";
import { logger } from "../../utils/logger.js";
import type { PrecacheController, PrecacheRouteOptions } from "./PrecacheController.js";

/**
 * A subclass of {@linkcode Route} that takes a {@linkcode Serwist} instance and uses it to match
 * incoming requests and handle fetching responses from the precache.
 */
export class PrecacheRoute extends Route {
  /**
   * @param controller A {@linkcode PrecacheController} instance.
   * @param options Options to control how requests are matched
   * against the list of precached URLs.
   */
  constructor(controller: PrecacheController, options?: PrecacheRouteOptions) {
    const match: RouteMatchCallback = ({ request }: RouteMatchCallbackOptions) => {
      const urlsToCacheKeys = controller.getUrlsToPrecacheKeys();
      for (const possibleURL of generateURLVariations(request.url, options)) {
        const cacheKey = urlsToCacheKeys.get(possibleURL);
        if (cacheKey) {
          const integrity = controller.getIntegrityForPrecacheKey(cacheKey);
          return { cacheKey, integrity };
        }
      }
      if (process.env.NODE_ENV !== "production") {
        logger.debug(`Precaching did not find a match for ${getFriendlyURL(request.url)}.`);
      }
      return;
    };

    super(match, controller.strategy);
  }
}
