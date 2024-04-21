/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { SerwistError } from "./utils/SerwistError.js";
import { assert } from "./utils/assert.js";
import type { PartialCacheNameDetails } from "./utils/cacheNames.js";
import { cacheNames } from "./utils/cacheNames.js";

/**
 * Modifies the default cache names used by Serwist packages.
 * Cache names are generated as `<prefix>-<Cache Name>-<suffix>`.
 *
 * @param details
 */
export const setCacheNameDetails = (details: PartialCacheNameDetails): void => {
  if (process.env.NODE_ENV !== "production") {
    for (const key of Object.keys(details)) {
      assert!.isType(details[key], "string", {
        moduleName: "@serwist/core",
        funcName: "setCacheNameDetails",
        paramName: `details.${key}`,
      });
    }

    if (details.precache?.length === 0) {
      throw new SerwistError("invalid-cache-name", {
        cacheNameId: "precache",
        value: details.precache,
      });
    }

    if (details.runtime?.length === 0) {
      throw new SerwistError("invalid-cache-name", {
        cacheNameId: "runtime",
        value: details.runtime,
      });
    }

    if (details.googleAnalytics?.length === 0) {
      throw new SerwistError("invalid-cache-name", {
        cacheNameId: "googleAnalytics",
        value: details.googleAnalytics,
      });
    }
  }

  cacheNames.updateDetails(details);
};
