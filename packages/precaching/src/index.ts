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
  PrecacheRoute,
  PrecacheStrategy,
} from "@serwist/sw/precaching";
export { PrecacheFallbackPlugin } from "@serwist/sw/plugins";
export type * from "@serwist/sw/precaching";
export type { UrlManipulation as urlManipulation } from "@serwist/sw/precaching";
export type { PrecacheFallbackEntry, PrecacheFallbackPluginOptions } from "@serwist/sw/plugins";
