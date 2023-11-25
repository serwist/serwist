/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


import { cacheNames } from "./cacheNames.js";
import { clientsClaim } from "./clientsClaim.js";
import { copyResponse } from "./copyResponse.js";
import { nonNullable } from "./nonNullable.js";
import { registerQuotaErrorCallback } from "./registerQuotaErrorCallback.js";
import { setCacheNameDetails } from "./setCacheNameDetails.js";

/**
 * All Serwist libraries use `@serwist/core` for shared code as well as 
 * setting default values that need to be shared (like cache names).
 */
export {
  cacheNames,
  clientsClaim,
  copyResponse,
  nonNullable,
  registerQuotaErrorCallback,
  setCacheNameDetails,
};

export * from "./types.js";
