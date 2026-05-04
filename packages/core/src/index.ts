import { cacheNames } from "$lib/cache-name.js";
import type { HTTPMethod } from "$lib/constants.js";
import { disableNavigationPreload, enableNavigationPreload, isNavigationPreloadSupported } from "$lib/navigation-preload.js";
import type { NavigationRouteMatchOptions } from "$lib/route.js";
import { NavigationRoute, RegExpRoute, Route } from "$lib/route.js";
import { Serwist, type SerwistOptions } from "$lib/serwist.js";
import { copyResponse, disableDevLogs, registerQuotaErrorCallback, setCacheNameDetails } from "$lib/utils.js";

// Background synchronizing
export {
  BackgroundSyncPlugin,
  BackgroundSyncQueue,
  BackgroundSyncQueueStore,
  StorableRequest,
  type BackgroundSyncQueueEntry,
  type BackgroundSyncQueueOptions,
} from "$lib/background-sync/index.js";

// Broadcasting updates
export {
  BROADCAST_UPDATE_DEFAULT_HEADERS,
  BroadcastCacheUpdate,
  BroadcastUpdatePlugin,
  responsesAreSame,
  type BroadcastCacheUpdateOptions,
  type BroadcastMessage,
  type BroadcastPayload,
  type BroadcastPayloadGenerator,
} from "$lib/broadcast-update/index.js";

// Setting cacheability criteria
export {
  CacheableResponse,
  CacheableResponsePlugin,
  type CacheableResponseOptions,
} from "$lib/cacheable-response/index.js";

// Controllers

// Expiring outdated responses
export {
  CacheExpiration,
  expiration,
  ExpirationPlugin,
  type ExpirationPluginOptions,
} from "$lib/expiration/index.js";

// Extensions
export {
  GoogleAnalytics,
  initializeGoogleAnalytics,
  PrecacheFallbackPlugin,
  PrecacheRoute,
  PrecacheStrategy,
  RuntimeCache,
  type GoogleAnalyticsInitializeOptions,
  type GoogleAnalyticsOptions,
  type PrecacheFallbackEntry,
  type PrecacheFallbackPluginOptions,
  type RuntimeCacheOptions,
} from "$lib/extensions/index.js";

// Handling range requests
export {
  createPartialResponse,
  RangeRequestsPlugin,
} from "$lib/range-requests/index.js";

// Built-in caching strategies
export {
  CacheFirst,
  cacheFirst,
  cacheMatch,
  CacheOnly,
  cacheOnly,
  cachePut,
  createHandler,
  createStrategy,
  destroyHandler,
  doneWaiting,
  fetch,
  fetchAndCachePut,
  getCacheKey,
  getPreloadResponse,
  hasCallback,
  iterateCallbacks,
  NetworkFirst,
  networkFirst,
  NetworkOnly,
  networkOnly,
  runCallbacks,
  StaleWhileRevalidate,
  staleWhileRevalidate,
  Strategy,
  StrategyHandler,
  waitUntil,
  type NetworkFirstOptions,
  type NetworkOnlyOptions,
  type StrategyOptions,
} from "$lib/strategies/index.js";

// Core
export {
  cacheNames,
  copyResponse,
  disableDevLogs,
  disableNavigationPreload,
  enableNavigationPreload,
  isNavigationPreloadSupported,
  // Routing
  NavigationRoute,
  RegExpRoute,
  registerQuotaErrorCallback,
  Route,
  Serwist,
  setCacheNameDetails,
};

// Core (modern)
// TODO(v11): rename once we remove legacy `Serwist` and `SerwistOptions`
export { createSerwist } from "$lib/core.js";
export type { SerwistOptions as CreateSerwistOptions, Serwist as SerwistState } from "$lib/core.js";
// Extension
export type * from "$lib/extension.js";
export {
  addEventListeners,
  createActivateHandler,
  createCacheHandler,
  createFetchHandler,
  createInstallHandler,
  iterateExtensions,
  setCatchHandler,
  setDefaultHandler,
} from "$lib/functions/handlers.js";
export { findMatchingRoute, handleRequest, registerCapture, registerRoute, unregisterRoute } from "$lib/functions/router.js";

export type * from "$lib/types.js";
export type { HTTPMethod, NavigationRouteMatchOptions, SerwistOptions };
