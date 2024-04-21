import { Deferred } from "./utils/Deferred.js";
import { SerwistError } from "./utils/SerwistError.js";
import { assert } from "./utils/assert.js";
import { cacheMatchIgnoreParams } from "./utils/cacheMatchIgnoreParams.js";
import { cacheNames as privateCacheNames } from "./utils/cacheNames.js";
import { canConstructReadableStream } from "./utils/canConstructReadableStream.js";
import { canConstructResponseFromBodyStream } from "./utils/canConstructResponseFromBodyStream.js";
import { cleanupOutdatedCaches } from "./utils/cleanupOutdatedCaches.js";
import { clientsClaim } from "./utils/clientsClaim.js";
import { dontWaitFor } from "./utils/dontWaitFor.js";
import { executeQuotaErrorCallbacks } from "./utils/executeQuotaErrorCallbacks.js";
import { getFriendlyURL } from "./utils/getFriendlyURL.js";
import { logger } from "./utils/logger.js";
import { resultingClientExists } from "./utils/resultingClientExists.js";
import { timeout } from "./utils/timeout.js";
import { waitUntil } from "./utils/waitUntil.js";

// Serwist's internal functions, classes, variables, and more. Feel free to use them,
// but they are not documented. Note: they do follow semver.
export {
  Deferred,
  SerwistError,
  assert,
  cleanupOutdatedCaches,
  clientsClaim,
  cacheMatchIgnoreParams,
  privateCacheNames,
  canConstructReadableStream,
  canConstructResponseFromBodyStream,
  dontWaitFor,
  executeQuotaErrorCallbacks,
  getFriendlyURL,
  logger,
  resultingClientExists,
  timeout,
  waitUntil,
};
