export type { CleanupResult, InstallResult, PrecacheEntry, PrecacheRouteOptions, UrlManipulation as urlManipulation } from "serwist";
export { PrecacheStrategy } from "serwist";
export { cleanupOutdatedCaches } from "serwist/internal";
export type { PrecacheFallbackEntry, PrecacheFallbackPluginOptions } from "serwist/legacy";
export {
  addPlugins,
  addRoute,
  createHandlerBoundToURL,
  getCacheKeyForURL,
  matchPrecache,
  PrecacheController,
  PrecacheFallbackPlugin,
  PrecacheRoute,
  precache,
  precacheAndRoute,
} from "serwist/legacy";
