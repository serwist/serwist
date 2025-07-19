/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import type { StrategyPlugin, StrategyPluginCallbackParam } from "#lib/types.js";
import type { Precache } from "./extension.js";

/**
 * A plugin, designed to be used with PrecacheController, to translate URLs into
 * the corresponding cache key, based on the current revision info.
 *
 * @private
 */
export class PrecacheCacheKeyPlugin implements StrategyPlugin {
  private readonly _precacheController: Precache;

  constructor({ precacheController }: { precacheController: Precache }) {
    this._precacheController = precacheController;
  }

  cacheKeyWillBeUsed: StrategyPlugin["cacheKeyWillBeUsed"] = async ({ request, params }: StrategyPluginCallbackParam["cacheKeyWillBeUsed"]) => {
    // Params is type any, can't change right now.
    /* eslint-disable */
    const cacheKey = params?.cacheKey || this._precacheController.getPrecacheKeyForUrl(request.url);
    /* eslint-enable */

    return cacheKey ? new Request(cacheKey, { headers: request.headers }) : request;
  };
}
