/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { cacheNames as privateCacheNames } from "./cache-names.js";
import { deleteOutdatedCaches } from "./delete-outdated-caches.js";
import { logger } from "./logger.js";

declare const self: ServiceWorkerGlobalScope;

/**
 * Cleans up incompatible precaches that were created by older versions
 * of Serwist.
 * @param cacheName
 * @returns
 */
export const deleteOutdatedPrecaches = (cacheName: string) =>
  deleteOutdatedCaches(cacheName).then((cachesDeleted) => {
    if (process.env.NODE_ENV !== "production") {
      if (cachesDeleted.length > 0) {
        logger.log("The following out-of-date precaches were cleaned up automatically:", cachesDeleted);
      }
    }
  });

/**
 * Adds an `activate` event listener which will clean up incompatible
 * precaches that were created by older versions of Serwist.
 */
export const cleanupOutdatedCaches = (cacheName?: string): void => {
  self.addEventListener("activate", (event: ExtendableEvent) => {
    event.waitUntil(deleteOutdatedPrecaches(privateCacheNames.getPrecacheName(cacheName)));
  });
};
