/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { cacheNames as privateCacheNames } from "./cacheNames.js";
import { deleteOutdatedCaches } from "./deleteOutdatedCaches.js";
import { logger } from "./logger.js";

declare const self: ServiceWorkerGlobalScope;

/**
 * Adds an `activate` event listener which will clean up incompatible
 * precaches that were created by older versions of Serwist.
 */
export const cleanupOutdatedCaches = (cacheName?: string): void => {
  self.addEventListener("activate", (event: ExtendableEvent) => {
    event.waitUntil(
      deleteOutdatedCaches(privateCacheNames.getPrecacheName(cacheName)).then((cachesDeleted) => {
        if (process.env.NODE_ENV !== "production") {
          if (cachesDeleted.length > 0) {
            logger.log("The following out-of-date precaches were cleaned up automatically:", cachesDeleted);
          }
        }
      }),
    );
  });
};
