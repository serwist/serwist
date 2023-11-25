import type { ManifestEntry } from "@serwist/build";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute, type PrecacheRouteOptions } from "@serwist/precaching";
import { NavigationRoute, registerRoute } from "@serwist/routing";

export type HandlePrecachingOptions = {
  manifestEntries?: ManifestEntry[];
  precacheOptions?: PrecacheRouteOptions;

  cleanupOutdatedCaches?: boolean;
} & ({ navigateFallback: string; navigateFallbackAllowlist?: RegExp[]; navigateFallbackDenylist?: RegExp[] } | { navigateFallback?: never });

export const handlePrecaching = ({
  manifestEntries,
  precacheOptions,
  cleanupOutdatedCaches: shouldCleanupOutdatedCaches = false,
  ...options
}: HandlePrecachingOptions) => {
  if (!!manifestEntries && manifestEntries.length > 0) {
    /**
     * The precacheAndRoute() method efficiently caches and responds to
     * requests for URLs in the manifest.
     * See https://goo.gl/S9QRab
     */
    precacheAndRoute(manifestEntries, precacheOptions);
  }

  if (shouldCleanupOutdatedCaches) cleanupOutdatedCaches();

  if (options.navigateFallback) {
    registerRoute(
      new NavigationRoute(createHandlerBoundToURL(options.navigateFallback), {
        allowlist: options.navigateFallbackAllowlist,
        denylist: options.navigateFallbackDenylist,
      })
    );
  }
};
