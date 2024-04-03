import { cleanupOutdatedCaches as cleanupOutdatedCachesImpl } from "../precaching/cleanupOutdatedCaches.js";
import { createHandlerBoundToURL } from "../precaching/createHandlerBoundToURL.js";
import { precacheAndRoute } from "../precaching/precacheAndRoute.js";
import type { PrecacheEntry, PrecacheRouteOptions } from "../precaching/types.js";
import { NavigationRoute } from "../routing/NavigationRoute.js";
import { registerRoute } from "../routing/registerRoute.js";

export interface HandlePrecachingOptions {
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
export const handlePrecaching = ({ precacheEntries, precacheOptions, cleanupOutdatedCaches = false, ...options }: HandlePrecachingOptions): void => {
  if (!!precacheEntries && precacheEntries.length > 0) {
    /**
     * The precacheAndRoute() method efficiently caches and responds to
     * requests for URLs in the manifest.
     * See https://goo.gl/S9QRab
     */
    precacheAndRoute(precacheEntries, precacheOptions);

    if (cleanupOutdatedCaches) cleanupOutdatedCachesImpl();

    if (options.navigateFallback) {
      registerRoute(
        new NavigationRoute(createHandlerBoundToURL(options.navigateFallback), {
          allowlist: options.navigateFallbackAllowlist,
          denylist: options.navigateFallbackDenylist,
        }),
      );
    }
  }
};
