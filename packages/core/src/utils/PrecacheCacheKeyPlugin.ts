/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { Serwist } from "../Serwist.js";
import type { SerwistPlugin, SerwistPluginCallbackParam } from "../types.js";

/**
 * A plugin, designed to be used with PrecacheController, to translate URLs into
 * the corresponding cache key, based on the current revision info.
 *
 * @private
 */
export class PrecacheCacheKeyPlugin implements SerwistPlugin {
  private readonly _precacheController: Serwist;

  constructor({ precacheController }: { precacheController: Serwist }) {
    this._precacheController = precacheController;
  }

  cacheKeyWillBeUsed: SerwistPlugin["cacheKeyWillBeUsed"] = async ({ request, params }: SerwistPluginCallbackParam["cacheKeyWillBeUsed"]) => {
    // Params is type any, can't change right now.
    /* eslint-disable */
    const cacheKey = params?.cacheKey || this._precacheController.getPrecacheKeyForUrl(request.url);
    /* eslint-enable */

    return cacheKey ? new Request(cacheKey, { headers: request.headers }) : request;
  };
}
