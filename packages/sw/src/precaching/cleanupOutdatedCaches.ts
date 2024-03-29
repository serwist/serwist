/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { logger, privateCacheNames } from "@serwist/core/internal";

import { deleteOutdatedCaches } from "./utils/deleteOutdatedCaches.js";

declare const self: ServiceWorkerGlobalScope;

/**
 * Adds an `activate` event listener which will clean up incompatible
 * precaches that were created by older versions of Serwist.
 */
export const cleanupOutdatedCaches = (): void => {
  self.addEventListener("activate", (event: ExtendableEvent) => {
    const cacheName = privateCacheNames.getPrecacheName();

    event.waitUntil(
      deleteOutdatedCaches(cacheName).then((cachesDeleted) => {
        if (process.env.NODE_ENV !== "production") {
          if (cachesDeleted.length > 0) {
            logger.log("The following out-of-date precaches were cleaned up automatically:", cachesDeleted);
          }
        }
      }),
    );
  });
};
