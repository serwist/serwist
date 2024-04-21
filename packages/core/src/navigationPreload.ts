import { logger } from "./utils/logger.js";

declare const self: ServiceWorkerGlobalScope;

/**
 * Checks whether the current browser supports
 * navigation preloading.
 *
 * @returns
 * @see https://serwist.pages.dev/docs/serwist/core/is-navigation-preload-supported
 */
export const isNavigationPreloadSupported = (): boolean => {
  return Boolean(self.registration?.navigationPreload);
};

/**
 * If the browser supports navigation preloading, then this will enable it.
 *
 * @param headerValue Optional. Allows developers to override the value of
 * the `Service-Worker-Navigation-Preload` header which will be sent to the
 * server when making the navigation request.
 * @see https://serwist.pages.dev/docs/serwist/core/enable-navigation-preload
 */
export const enableNavigationPreload = (headerValue?: string): void => {
  if (isNavigationPreloadSupported()) {
    self.addEventListener("activate", (event) => {
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

/**
 * If the browser supports navigation preloading, then this will disable it.
 *
 * @see https://serwist.pages.dev/docs/serwist/core/disable-navigation-preload
 */
export const disableNavigationPreload = (): void => {
  if (isNavigationPreloadSupported()) {
    self.addEventListener("activate", (event: ExtendableEvent) => {
      event.waitUntil(
        self.registration.navigationPreload.disable().then(() => {
          if (process.env.NODE_ENV !== "production") {
            logger.log("Navigation preloading is disabled.");
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
