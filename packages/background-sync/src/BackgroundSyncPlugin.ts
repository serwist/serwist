/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { SerwistPlugin } from "@serwist/core";

import type { QueueOptions } from "./Queue.js";
import { Queue } from "./Queue.js";

/**
 * A class implementing the `fetchDidFail` lifecycle callback. This makes it
 * easier to add failed requests to a background sync Queue.
 */
class BackgroundSyncPlugin implements SerwistPlugin {
  private readonly _queue: Queue;

  /**
   * @param name See the `@serwist/background-sync.Queue`
   * documentation for parameter details.
   * @param options See the `@serwist/background-sync.Queue`
   * documentation for parameter details.
   */
  constructor(name: string, options?: QueueOptions) {
    this._queue = new Queue(name, options);
  }

  /**
   * @param options
   * @private
   */
  fetchDidFail: SerwistPlugin["fetchDidFail"] = async ({ request }) => {
    await this._queue.pushRequest({ request });
  };
}

export { BackgroundSyncPlugin };
