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
   * Construct a {@linkcode BroadcastCacheUpdate} instance with
   * the passed options and calls its {@linkcode BroadcastCacheUpdate.notifyIfUpdated}
   * method whenever the plugin's {@linkcode BroadcastUpdatePlugin.cacheDidUpdate} callback
   * is invoked.
   *
   * @param options
   */
  constructor(options?: BroadcastCacheUpdateOptions) {
    this._broadcastUpdate = new BroadcastCacheUpdate(options);
  }

  /**
   * @private
   * @param options The input object to this function.
   */
  cacheDidUpdate(options: CacheDidUpdateCallbackParam) {
    void this._broadcastUpdate.notifyIfUpdated(options);
  }
}
