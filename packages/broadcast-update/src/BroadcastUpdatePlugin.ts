/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


import type { SerwistPlugin } from "@serwist/core";
import { dontWaitFor } from "@serwist/core/internal";

import type { BroadcastCacheUpdateOptions } from "./BroadcastCacheUpdate.js";
import { BroadcastCacheUpdate } from "./BroadcastCacheUpdate.js";

/**
 * This plugin will automatically broadcast a message whenever a cached response
 * is updated.
 */
class BroadcastUpdatePlugin implements SerwistPlugin {
  private readonly _broadcastUpdate: BroadcastCacheUpdate;

  /**
   * Construct a `@serwist/broadcast-update.BroadcastCacheUpdate` instance with
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
  cacheDidUpdate: SerwistPlugin["cacheDidUpdate"] = async (options) => {
    dontWaitFor(this._broadcastUpdate.notifyIfUpdated(options));
  };
}

export { BroadcastUpdatePlugin };
