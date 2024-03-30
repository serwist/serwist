/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { FetchDidFailCallbackParam, SerwistPlugin } from "@serwist/core";

import type { QueueOptions } from "./Queue.js";
import { Queue } from "./Queue.js";

/**
 * A class implementing the `fetchDidFail` lifecycle callback. This makes it
 * easier to add failed requests to a background sync Queue.
 */
export class BackgroundSyncPlugin implements SerwistPlugin {
  private readonly _queue: Queue;

  /**
   * @param name See the `@serwist/sw/plugins.BackgroundSyncQueue`
   * documentation for parameter details.
   * @param options See the `@serwist/sw/plugins.BackgroundSyncQueue`
   * documentation for parameter details.
   * @see https://serwist.pages.dev/docs/background-sync/queue
   */
  constructor(name: string, options?: QueueOptions) {
    this._queue = new Queue(name, options);
  }

  /**
   * @param options
   * @private
   */
  async fetchDidFail({ request }: FetchDidFailCallbackParam) {
    await this._queue.pushRequest({ request });
  }
}