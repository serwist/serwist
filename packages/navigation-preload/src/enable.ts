/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { logger } from "@serwist/core/internal";

import { isSupported } from "./isSupported.js";

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;

/**
 * If the browser supports navigation preloading, then this will enable it.
 *
 * @param headerValue Optional. Allows developers to override the value of
 * the `Service-Worker-Navigation-Preload` header which will be sent to the
 * server when making the navigation request.
 */
export const enable = (headerValue?: string): void => {
  if (isSupported()) {
    self.addEventListener("activate", (event: ExtendableEvent) => {
      event.waitUntil(
        self.registration.navigationPreload.enable().then(() => {
          // Defaults to Service-Worker-Navigation-Preload: true if not set.
          if (headerValue) {
            void self.registration.navigationPreload.setHeaderValue(headerValue);
          }

          if (process.env.NODE_ENV !== "production") {
            logger.log("Navigation preloading is enabled.");
          }
        }),
      );
    });
  } else {
    if (process.env.NODE_ENV !== "production") {
      logger.log("Navigation preloading is not supported in this browser.");
    }
  }
};
