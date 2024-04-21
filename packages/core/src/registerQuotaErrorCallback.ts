/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { quotaErrorCallbacks } from "./models/quotaErrorCallbacks.js";
import { assert } from "./utils/assert.js";
import { logger } from "./utils/logger.js";

/**
 * Adds a function to the set of quotaErrorCallbacks that will be executed if
 * there's a quota error.
 *
 * @param callback
 */
// biome-ignore lint/complexity/noBannedTypes: Can't change Function type
export const registerQuotaErrorCallback = (callback: Function): void => {
  if (process.env.NODE_ENV !== "production") {
    assert!.isType(callback, "function", {
      moduleName: "@serwist/core",
      funcName: "register",
      paramName: "callback",
    });
  }

  quotaErrorCallbacks.add(callback);

  if (process.env.NODE_ENV !== "production") {
    logger.log("Registered a callback to respond to quota errors.", callback);
  }
};
