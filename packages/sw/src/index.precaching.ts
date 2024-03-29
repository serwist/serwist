import { PrecacheController } from "./precaching/PrecacheController.js";
import { PrecacheRoute } from "./precaching/PrecacheRoute.js";
import { PrecacheStrategy } from "./precaching/PrecacheStrategy.js";
import { addPlugins } from "./precaching/addPlugins.js";
import { addRoute } from "./precaching/addRoute.js";
import { cleanupOutdatedCaches } from "./precaching/cleanupOutdatedCaches.js";
import { createHandlerBoundToURL } from "./precaching/createHandlerBoundToURL.js";
import { getCacheKeyForURL } from "./precaching/getCacheKeyForURL.js";
import { matchPrecache } from "./precaching/matchPrecache.js";
import { precache } from "./precaching/precache.js";
import { precacheAndRoute } from "./precaching/precacheAndRoute.js";

/**
 * Most consumers of this module will want to use the
 * `@serwist/sw/precaching.precacheAndRoute`
 * method to add assets to the cache and respond to network requests with these
 * cached assets.
 *
 * If you require more control over caching and routing, you can use the
 * `@serwist/precaching.PrecacheController`
 * interface.
 */

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
};

export type * from "./precaching/types.js";
