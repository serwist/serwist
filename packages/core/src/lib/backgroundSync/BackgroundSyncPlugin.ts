/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { FetchDidFailCallbackParam, StrategyPlugin } from "../../types.js";
import type { BackgroundSyncQueueOptions } from "./BackgroundSyncQueue.js";
import { BackgroundSyncQueue } from "./BackgroundSyncQueue.js";

/**
 * A class implementing the `fetchDidFail` lifecycle callback. This makes it
 * easier to add failed requests to a {@linkcode BackgroundSyncQueue}.
 */
export class BackgroundSyncPlugin implements StrategyPlugin {
  private readonly _queue: BackgroundSyncQueue;

  /**
   * @param name See the {@linkcode BackgroundSyncQueue}
   * documentation for parameter details.
   * @param options See the {@linkcode BackgroundSyncQueue}
   * documentation for parameter details.
   * @see https://serwist.pages.dev/docs/serwist/core/background-sync-queue
   */
  constructor(name: string, options?: BackgroundSyncQueueOptions) {
    this._queue = new BackgroundSyncQueue(name, options);
  }

  /**
   * @param options
   * @private
   */
  async fetchDidFail({ request }: FetchDidFailCallbackParam) {
    await this._queue.pushRequest({ request });
  }
}
