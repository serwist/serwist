/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { SerwistPlugin } from "../../types.js";
import type { CacheableResponseOptions } from "./CacheableResponse.js";
import { CacheableResponse } from "./CacheableResponse.js";

/**
 * A class implementing the `cacheWillUpdate` lifecycle callback. This makes it
 * easier to add in cacheability checks to requests made via Serwist's built-in
 * strategies.
 */
export class CacheableResponsePlugin implements SerwistPlugin {
  private readonly _cacheableResponse: CacheableResponse;

  /**
   * To construct a new CacheableResponsePlugin instance you must provide at
   * least one of the `config` properties.
   *
   * If both `statuses` and `headers` are specified, then both conditions must
   * be met for the `Response` to be considered cacheable.
   *
   * @param config
   */
  constructor(config: CacheableResponseOptions) {
    this._cacheableResponse = new CacheableResponse(config);
  }

  /**
   * @param options
   * @returns
   * @private
   */
  cacheWillUpdate: SerwistPlugin["cacheWillUpdate"] = async ({ response }) => {
    if (this._cacheableResponse.isResponseCacheable(response)) {
      return response;
    }
    return null;
  };
}
