import type { PrecacheEntry, PrecacheRouteOptions } from "@serwist/precaching";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "@serwist/precaching";
import { NavigationRoute, registerRoute } from "@serwist/routing";

export type HandlePrecachingOptions = {
  precacheEntries?: (PrecacheEntry | string)[];
  precacheOptions?: PrecacheRouteOptions;

  cleanupOutdatedCaches?: boolean;
} & ({ navigateFallback: string; navigateFallbackAllowlist?: RegExp[]; navigateFallbackDenylist?: RegExp[] } | { navigateFallback?: never });

export const handlePrecaching = ({
  precacheEntries,
  precacheOptions,
  cleanupOutdatedCaches: shouldCleanupOutdatedCaches = false,
  ...options
}: HandlePrecachingOptions) => {
  if (!!precacheEntries && precacheEntries.length > 0) {
    /**
     * The precacheAndRoute() method efficiently caches and responds to
     * requests for URLs in the manifest.
     * See https://goo.gl/S9QRab
     */
    precacheAndRoute(precacheEntries, precacheOptions);
  }

  if (shouldCleanupOutdatedCaches) cleanupOutdatedCaches();

  if (options.navigateFallback) {
    registerRoute(
      new NavigationRoute(createHandlerBoundToURL(options.navigateFallback), {
        allowlist: options.navigateFallbackAllowlist,
        denylist: options.navigateFallbackDenylist,
      }),
    );
  }
};
