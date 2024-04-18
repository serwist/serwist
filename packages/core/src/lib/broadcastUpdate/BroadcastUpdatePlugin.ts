/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { CacheDidUpdateCallbackParam, SerwistPlugin } from "../../types.js";
import { BroadcastCacheUpdate } from "./BroadcastCacheUpdate.js";
import type { BroadcastCacheUpdateOptions } from "./types.js";

/**
 * A class implementing the `cacheDidUpdate` lifecycle callback. It will automatically
 * broadcast a message whenever a cached response is updated.
 */
export class BroadcastUpdatePlugin implements SerwistPlugin {
  private readonly _broadcastUpdate: BroadcastCacheUpdate;

  /**
   * Construct a `serwist.BroadcastCacheUpdate` instance with
   * the passed options and calls its `notifyIfUpdated` method whenever the
   * plugin's `cacheDidUpdate` callback is invoked.
   *
   * @param options
   */
  constructor(options?: BroadcastCacheUpdateOptions) {
    this._broadcastUpdate = new BroadcastCacheUpdate(options);
  }

  /**
   * A "lifecycle" callback that will be triggered automatically by
   * `@serwist/build.RuntimeCaching` handlers when an entry is
   * added to a cache.
   *
   * @private
   * @param options The input object to this function.
   */
  cacheDidUpdate(options: CacheDidUpdateCallbackParam) {
    void this._broadcastUpdate.notifyIfUpdated(options);
  }
}
