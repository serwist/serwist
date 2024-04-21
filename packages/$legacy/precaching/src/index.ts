export { PrecacheStrategy } from "serwist";
export {
  addPlugins,
  addRoute,
  createHandlerBoundToURL,
  getCacheKeyForURL,
  matchPrecache,
  precache,
  precacheAndRoute,
  PrecacheController,
  PrecacheFallbackPlugin,
  PrecacheRoute,
} from "serwist/legacy";
export { cleanupOutdatedCaches } from "serwist/internal";
export type { CleanupResult, InstallResult, PrecacheEntry, PrecacheRouteOptions, UrlManipulation as urlManipulation } from "serwist";
export type { PrecacheFallbackEntry, PrecacheFallbackPluginOptions } from "serwist/legacy";
