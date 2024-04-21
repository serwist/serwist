import { NavigationRoute } from "../NavigationRoute.js";
import type { PrecacheEntry, PrecacheRouteOptions } from "../types.js";
import { cleanupOutdatedCaches as cleanupOutdatedCachesImpl } from "../utils/cleanupOutdatedCaches.js";
import type { PrecacheController } from "./PrecacheController.js";
import { PrecacheRoute } from "./PrecacheRoute.js";
import type { Router } from "./Router.js";
import { createHandlerBoundToURL } from "./createHandlerBoundToURL.js";
import { getSingletonPrecacheController } from "./singletonPrecacheController.js";
import { getSingletonRouter } from "./singletonRouter.js";

/**
 * @deprecated
 */
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
 * @param options
 * @deprecated
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
      router.registerRoute(
        new NavigationRoute(createHandlerBoundToURL(navigateFallback), {
          allowlist: navigateFallbackAllowlist,
          denylist: navigateFallbackDenylist,
        }),
      );
    }
  }
};
