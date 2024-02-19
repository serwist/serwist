/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;

/**
 * Checks whether the current browser supports
 * navigation preloading.
 *
 * @returns
 */
export const isSupported = (): boolean => {
  return Boolean(self.registration?.navigationPreload);
};
