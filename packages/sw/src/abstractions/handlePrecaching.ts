import type { PrecacheController } from "../precaching/PrecacheController.js";
import { PrecacheRoute } from "../precaching/PrecacheRoute.js";
import { cleanupOutdatedCaches as cleanupOutdatedCachesImpl } from "../precaching/cleanupOutdatedCaches.js";
import { createHandlerBoundToURL } from "../precaching/createHandlerBoundToURL.js";
import { getSingletonPrecacheController } from "../precaching/singletonPrecacheController.js";
import type { PrecacheEntry, PrecacheRouteOptions } from "../precaching/types.js";
import { NavigationRoute } from "../routing/NavigationRoute.js";
import type { Router } from "../routing/Router.js";
import { registerRoute } from "../routing/registerRoute.js";
import { getSingletonRouter } from "../routing/singletonRouter.js";

export interface HandlePrecachingOptions {
  /**
   * An optional `PrecacheController` instance. If not provided, the singleton
   * `PrecacheController` will be used.
   */
  precacheController?: PrecacheController;
  /**
   * An optional `Router` instance. If not provided, the singleton `Router`
   * will be used.
   */
  router?: Router;
  /**
   * A list of URLs that should be cached.
   */
  precacheEntries?: (PrecacheEntry | string)[];
  /**
   * Options to customize how Serwist precaches the URLs.
   */
  precacheOptions?: PrecacheRouteOptions;
  /**
   * Whether outdated caches should be removed.
   *
   * @default false
   */
  cleanupOutdatedCaches?: boolean;
  /**
   * An URL that should point to a HTML file with which navigation requests for URLs that aren't
   * precached will be fulfilled.
   */
  navigateFallback?: string;
  /**
   * URLs that should be allowed to use the `navigateFallback` handler.
   */
  navigateFallbackAllowlist?: RegExp[];
  /**
   * URLs that should not be allowed to use the `navigateFallback` handler. This takes precedence
   * over `navigateFallbackAllowlist`.
   */
  navigateFallbackDenylist?: RegExp[];
}

/**
 * Handles a list of precache entries and cleans up outdated caches.
 *
 * @see https://serwist.pages.dev/docs/sw/abstractions/handle-precaching
 * @param options
 */
export const handlePrecaching = ({
  precacheController = getSingletonPrecacheController(),
  router = getSingletonRouter(),
  precacheEntries,
  precacheOptions,
  cleanupOutdatedCaches = false,
  navigateFallback,
  navigateFallbackAllowlist,
  navigateFallbackDenylist,
}: HandlePrecachingOptions): void => {
  if (!!precacheEntries && precacheEntries.length > 0) {
    precacheController.precache(precacheEntries);
    router.registerRoute(new PrecacheRoute(precacheController, precacheOptions));

    if (cleanupOutdatedCaches) cleanupOutdatedCachesImpl();

    if (navigateFallback) {
      registerRoute(
        new NavigationRoute(createHandlerBoundToURL(navigateFallback), {
          allowlist: navigateFallbackAllowlist,
          denylist: navigateFallbackDenylist,
        }),
      );
    }
  }
};
