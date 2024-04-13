export {
  addPlugins,
  addRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  getCacheKeyForURL,
  matchPrecache,
  precache,
  precacheAndRoute,
  PrecacheController,
  PrecacheFallbackPlugin,
  PrecacheRoute,
  PrecacheOnly as PrecacheStrategy,
} from "serwist/legacy";
export type { CleanupResult, InstallResult, PrecacheEntry, PrecacheRouteOptions, UrlManipulation as urlManipulation } from "serwist";
export type { PrecacheFallbackEntry, PrecacheFallbackPluginOptions } from "serwist/legacy";
