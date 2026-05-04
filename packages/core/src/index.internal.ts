import { assert } from "$utils/assert.js";
import { cacheMatchIgnoreParams } from "$utils/cache-match-ignore-params.js";
import { cacheNames as privateCacheNames } from "$utils/cache-names.js";
import { canConstructReadableStream } from "$utils/can-construct-readable-stream.js";
import { canConstructResponseFromBodyStream } from "$utils/can-construct-response-from-body-stream.js";
import { cleanupOutdatedCaches } from "$utils/cleanup-outdated-caches.js";
import { clientsClaim } from "$utils/clients-claim.js";
import { Deferred } from "$utils/deferred.js";
import { dontWaitFor } from "$utils/dont-wait-for.js";
import { executeQuotaErrorCallbacks } from "$utils/execute-quota-error-callbacks.js";
import { getFriendlyURL } from "$utils/get-friendly-url.js";
import { logger } from "$utils/logger.js";
import { resultingClientExists } from "$utils/resulting-client-exists.js";
import { SerwistError } from "$utils/serwist-error.js";
import { timeout } from "$utils/timeout.js";
import { waitUntil } from "$utils/wait-until.js";

// Serwist's internal functions, classes, variables, and more. Feel free to use them,
// but they are not documented. Note: they do follow semver.
export {
  assert,
  cacheMatchIgnoreParams,
  canConstructReadableStream,
  canConstructResponseFromBodyStream,
  cleanupOutdatedCaches,
  clientsClaim,
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
