/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { HandlerDidErrorCallbackParam, SerwistPlugin } from "../types.js";
import type { PrecacheController } from "./PrecacheController.js";
import { getSingletonPrecacheController } from "./singletonPrecacheController.js";

/**
 * @deprecated
 */
export interface PrecacheFallbackEntry {
  /**
   * A function that checks whether the fallback entry can be used
   * for a request.
   */
  matcher: (param: HandlerDidErrorCallbackParam) => boolean;
  /**
   * A precached URL to be used as a fallback.
   */
  url: string;
}

/**
 * @deprecated
 */
export interface PrecacheFallbackPluginOptions {
  /**
   * Precached URLs to be used as the fallback
   * if the associated strategy can't generate a response.
   */
  fallbackUrls: (string | PrecacheFallbackEntry)[];
  /**
   * An optional `PrecacheController` instance. If not provided, the default
   * `PrecacheController` will be used.
   */
  precacheController?: PrecacheController;
}

/**
 * `PrecacheFallbackPlugin` allows you to specify offline fallbacks
 * to be used when a given strategy is unable to generate a response.
 *
 * It does this by intercepting the `handlerDidError` plugin callback
 * and returning a precached response, taking the expected revision parameter
 * into account automatically.
 *
 * Unless you explicitly pass in a `PrecacheController` instance to the
 * constructor, the default instance will be used. Generally speaking, most
 * developers will end up using the default.
 *
 * @deprecated
 */
export class PrecacheFallbackPlugin implements SerwistPlugin {
  private readonly _fallbackUrls: (string | PrecacheFallbackEntry)[];
  private readonly _precacheController: PrecacheController;

  /**
   * Constructs a new `PrecacheFallbackPlugin` with the associated `fallbackUrls`.
   *
   * @param config
   */
  constructor({ fallbackUrls, precacheController }: PrecacheFallbackPluginOptions) {
    this._fallbackUrls = fallbackUrls;
    this._precacheController = precacheController || getSingletonPrecacheController();
  }

  /**
   * @returns The precache response for one of the fallback URLs, or `undefined` if
   * nothing satisfies the conditions.
   * @private
   */
  async handlerDidError(param: HandlerDidErrorCallbackParam) {
    for (const fallback of this._fallbackUrls) {
      if (typeof fallback === "string") {
        const fallbackResponse = await this._precacheController.matchPrecache(fallback);
        if (fallbackResponse !== undefined) {
          return fallbackResponse;
        }
      } else if (fallback.matcher(param)) {
        const fallbackResponse = await this._precacheController.matchPrecache(fallback.url);
        if (fallbackResponse !== undefined) {
          return fallbackResponse;
        }
      }
    }
    return undefined;
  }
}
