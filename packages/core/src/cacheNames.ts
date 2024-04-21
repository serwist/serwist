/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { cacheNames as privateCacheNames } from "./utils/cacheNames.js";

/**
 * Get the current cache names and prefix/suffix used by Serwist.
 *
 * `cacheNames.precache` is used for precached assets,
 * `cacheNames.googleAnalytics` is used by `@serwist/google-analytics` to
 * store `analytics.js`, and `cacheNames.runtime` is used for everything else.
 *
 * `cacheNames.prefix` can be used to retrieve just the current prefix value.
 * `cacheNames.suffix` can be used to retrieve just the current suffix value.
 *
 * @returns An object with `precache`, `runtime`, `prefix`, and `googleAnalytics` properties.
 */
export const cacheNames = {
  get googleAnalytics(): string {
    return privateCacheNames.getGoogleAnalyticsName();
  },
  get precache(): string {
    return privateCacheNames.getPrecacheName();
  },
  get prefix(): string {
    return privateCacheNames.getPrefix();
  },
  get runtime(): string {
    return privateCacheNames.getRuntimeName();
  },
  get suffix(): string {
    return privateCacheNames.getSuffix();
  },
};
