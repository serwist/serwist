/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { PrecacheController } from "#lib/controllers/PrecacheController/PrecacheController.js";
import type { Serwist } from "../../Serwist.js";
import type { HandlerDidErrorCallbackParam, StrategyPlugin } from "../../types.js";

export interface PrecacheFallbackEntry {
  /**
   * A precached URL to be used as a fallback.
   */
  url: string;
  /**
   * A function that checks whether the fallback entry can be used
   * for a request.
   */
  matcher: (param: HandlerDidErrorCallbackParam) => boolean;
}

export interface PrecacheFallbackPluginOptions {
  /**
   * Precached URLs to be used as the fallback
   * if the associated strategy can't generate a response.
   */
  fallbackUrls: (string | PrecacheFallbackEntry)[];
  /**
   * A {@linkcode PrecacheController} instance.
   */
  precacheController: PrecacheController;
  /**
   * A {@linkcode Serwist} instance.
   * @deprecated Use `precacheController` instead.
   */
  serwist?: Serwist;
}

/**
 * Allows you to specify offline fallbacks to be used when a given strategy
 * is unable to generate a response.
 *
 * It does this by intercepting the `handlerDidError` plugin callback
 * and returning a precached response, taking the expected revision parameter
 * into account automatically.
 */
export class PrecacheFallbackPlugin implements StrategyPlugin {
  private readonly _fallbackUrls: (string | PrecacheFallbackEntry)[];
  private readonly _precacheController: PrecacheController;

  /**
   * Constructs a new instance with the associated `fallbackUrls`.
   *
   * @param config
   */
  constructor({ fallbackUrls, precacheController, serwist }: PrecacheFallbackPluginOptions) {
    this._fallbackUrls = fallbackUrls;
    // TODO(ducanhgh): remove in v11.
    if (!serwist) {
      this._precacheController = precacheController;
    } else {
      this._precacheController = serwist.precache;
    }
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
