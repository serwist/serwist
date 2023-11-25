/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { assert } from "./_private/assert.js";
import { cacheMatchIgnoreParams } from "./_private/cacheMatchIgnoreParams.js";
import { cacheNames as privateCacheNames } from "./_private/cacheNames.js";
import { canConstructReadableStream } from "./_private/canConstructReadableStream.js";
import { canConstructResponseFromBodyStream } from "./_private/canConstructResponseFromBodyStream.js";
import { Deferred } from "./_private/Deferred.js";
import { dontWaitFor } from "./_private/dontWaitFor.js";
import { executeQuotaErrorCallbacks } from "./_private/executeQuotaErrorCallbacks.js";
import { getFriendlyURL } from "./_private/getFriendlyURL.js";
import { logger } from "./_private/logger.js";
import { resultingClientExists } from "./_private/resultingClientExists.js";
import { SerwistError } from "./_private/SerwistError.js";
import { timeout } from "./_private/timeout.js";
import { waitUntil } from "./_private/waitUntil.js";
import { cacheNames } from "./cacheNames.js";
import { clientsClaim } from "./clientsClaim.js";
import { copyResponse } from "./copyResponse.js";
import { registerQuotaErrorCallback } from "./registerQuotaErrorCallback.js";
import { setCacheNameDetails } from "./setCacheNameDetails.js";

/**
 * All Serwist libraries use `@serwist/core` for shared code as well as
 * setting default values that need to be shared (like cache names).
 */
export { cacheNames, clientsClaim, copyResponse, registerQuotaErrorCallback, setCacheNameDetails };

export * from "./types.js";

// Serwist's internal functions, classes, variables, and more. Feel free to use them,
// but they are not documented.
export {
  assert,
  cacheMatchIgnoreParams,
  canConstructReadableStream,
  canConstructResponseFromBodyStream,
  Deferred,
  dontWaitFor,
  executeQuotaErrorCallbacks,
  getFriendlyURL,
  logger,
  privateCacheNames,
  resultingClientExists,
  SerwistError,
  timeout,
  waitUntil,
};
