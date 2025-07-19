/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { Serwist } from "#lib/core.js";
import { generateURLVariations } from "#utils/generateURLVariations.js";
import { getFriendlyURL } from "#utils/getFriendlyURL.js";
import { logger } from "#utils/logger.js";
import { Route } from "../../route.js";
import type { RouteMatchCallback, RouteMatchCallbackOptions, UrlManipulation } from "../../types.js";
import type { Precache } from "./extension.js";

export interface PrecacheRouteOptions {
  /**
   * Tells Serwist to check the precache for an entry whose URL is the request URL appended
   * with the specified value. Only applies if the request URL ends with "/".
   *
   * @default "index.html"
   */
  directoryIndex?: string | null;
  /**
   * An array of `RegExp` objects matching search params that should be removed when looking
   * for a precache match.
   */
  ignoreURLParametersMatching?: RegExp[];
  /**
   * Tells Serwist to check the precache for an entry whose URL is the request URL appended
   * with ".html".
   *
   * @default true
   */
  cleanURLs?: boolean;
  /**
   * A function that should take a URL and return an array of alternative URLs that should
   * be checked for precache matches.
   */
  urlManipulation?: UrlManipulation;
}

/**
 * A subclass of {@linkcode Route} that takes a {@linkcode Serwist} instance and uses it to match
 * incoming requests and handle fetching responses from the precache.
 */
export class PrecacheRoute extends Route {
  /**
   * @param precache A {@linkcode Precache} instance.
   * @param options Options to control how requests are matched
   * against the list of precached URLs.
   */
  constructor(precache: Precache, options?: PrecacheRouteOptions) {
    const match: RouteMatchCallback = ({ request }: RouteMatchCallbackOptions) => {
      const urlsToCacheKeys = precache.getUrlsToPrecacheKeys();
      for (const possibleURL of generateURLVariations(request.url, options)) {
        const cacheKey = urlsToCacheKeys.get(possibleURL);
        if (cacheKey) {
          const integrity = precache.getIntegrityForPrecacheKey(cacheKey);
          return { cacheKey, integrity };
        }
      }
      if (process.env.NODE_ENV !== "production") {
        logger.debug(`Precaching did not find a match for ${getFriendlyURL(request.url)}.`);
      }
      return;
    };

    super(match, precache.strategy);
  }
}
