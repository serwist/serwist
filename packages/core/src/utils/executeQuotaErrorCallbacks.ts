/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { quotaErrorCallbacks } from "../models/quotaErrorCallbacks.js";
import { logger } from "./logger.js";

/**
 * Runs all of the callback functions, one at a time sequentially, in the order
 * in which they were registered.
 *
 * @private
 */
export const executeQuotaErrorCallbacks = async (): Promise<void> => {
  if (process.env.NODE_ENV !== "production") {
    logger.log(`About to run ${quotaErrorCallbacks.size} callbacks to clean up caches.`);
  }

  for (const callback of quotaErrorCallbacks) {
    await callback();
    if (process.env.NODE_ENV !== "production") {
      logger.log(callback, "is complete.");
    }
  }

  if (process.env.NODE_ENV !== "production") {
    logger.log("Finished running callbacks.");
  }
};
