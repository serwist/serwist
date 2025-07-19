import { cacheNames } from "#lib/cache-name.js";
import type { HTTPMethod } from "#lib/constants.js";
import { disableNavigationPreload, enableNavigationPreload, isNavigationPreloadSupported } from "#lib/navigation-preload.js";
import type { NavigationRouteMatchOptions } from "#lib/route.js";
import { NavigationRoute, RegExpRoute, Route } from "#lib/route.js";
import { Serwist, type SerwistOptions } from "#lib/serwist.js";
import { copyResponse, disableDevLogs, registerQuotaErrorCallback, setCacheNameDetails } from "#lib/utils.js";

// Background synchronizing
export {
  BackgroundSyncPlugin,
  BackgroundSyncQueue,
  type BackgroundSyncQueueEntry,
  type BackgroundSyncQueueOptions,
  BackgroundSyncQueueStore,
  StorableRequest,
} from "#lib/background-sync/index.js";

// Broadcasting updates
export {
  BROADCAST_UPDATE_DEFAULT_HEADERS,
  BroadcastCacheUpdate,
  type BroadcastCacheUpdateOptions,
  type BroadcastMessage,
  type BroadcastPayload,
  type BroadcastPayloadGenerator,
  BroadcastUpdatePlugin,
  responsesAreSame,
} from "#lib/broadcast-update/index.js";

// Setting cacheability criteria
export {
  CacheableResponse,
  type CacheableResponseOptions,
  CacheableResponsePlugin,
} from "#lib/cacheable-response/index.js";

// Controllers

// Expiring outdated responses
export {
  CacheExpiration,
  ExpirationPlugin,
  type ExpirationPluginOptions,
} from "#lib/expiration/index.js";

// Extensions
export {
  GoogleAnalytics,
  type GoogleAnalyticsInitializeOptions,
  type GoogleAnalyticsOptions,
  initializeGoogleAnalytics,
  type PrecacheFallbackEntry,
  PrecacheFallbackPlugin,
  type PrecacheFallbackPluginOptions,
  PrecacheRoute,
  PrecacheStrategy,
  RuntimeCache,
  type RuntimeCacheOptions,
} from "#lib/extensions/index.js";

// Handling range requests
export {
  createPartialResponse,
  RangeRequestsPlugin,
} from "#lib/range-requests/index.js";

// Built-in caching strategies
export {
  CacheFirst,
  CacheOnly,
  NetworkFirst,
  type NetworkFirstOptions,
  NetworkOnly,
  type NetworkOnlyOptions,
  StaleWhileRevalidate,
  Strategy,
  StrategyHandler,
  type StrategyOptions,
} from "#lib/strategies/index.js";

// Core
export {
  Serwist,
  cacheNames,
  copyResponse,
  disableDevLogs,
  disableNavigationPreload,
  enableNavigationPreload,
  isNavigationPreloadSupported,
  registerQuotaErrorCallback,
  setCacheNameDetails,
  // Routing
  NavigationRoute,
  RegExpRoute,
  Route,
};

// Core (modern)
// TODO(v11): rename once we remove legacy `Serwist` and `SerwistOptions`
export type { Serwist as SerwistState, SerwistOptions as CreateSerwistOptions } from "#lib/core.js";
export { createSerwist } from "#lib/core.js";
// Extension
export type * from "#lib/extension.js";
export {
  addEventListeners,
  createActivateHandler,
  createCacheHandler,
  createFetchHandler,
  createInstallHandler,
  iterateExtensions,
  setCatchHandler,
  setDefaultHandler,
} from "#lib/functions/handlers.js";
export { findMatchingRoute, handleRequest, registerCapture, registerRoute, unregisterRoute } from "#lib/functions/router.js";

export type { HTTPMethod, SerwistOptions, NavigationRouteMatchOptions };
export type * from "#lib/types.js";
