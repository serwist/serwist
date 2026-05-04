import { NavigationRoute } from "$lib/route.js";
import type { PrecacheEntry, PrecacheRouteOptions } from "$lib/types.js";
import { cleanupOutdatedCaches as cleanupOutdatedCachesImpl } from "../utils/cleanup-outdated-caches.js";
import { createHandlerBoundToURL } from "./create-handler-bound-to-url.js";
import type { PrecacheController } from "./precache-controller.js";
import { PrecacheRoute } from "./precache-route.js";
import type { Router } from "./router.js";
import { getSingletonPrecacheController } from "./singleton-precache-controller.js";
import { getSingletonRouter } from "./singleton-router.js";

/**
 * @deprecated
 */
export interface HandlePrecachingOptions {
  /**
   * An optional {@linkcode PrecacheController} instance. If not provided, the singleton
   * {@linkcode PrecacheController} will be used.
   */
  precacheController?: PrecacheController;
  /**
   * An optional {@linkcode Router} instance. If not provided, the singleton {@linkcode Router}
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
