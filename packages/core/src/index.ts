import type { NavigationRouteMatchOptions } from "./NavigationRoute.js";
import { NavigationRoute } from "./NavigationRoute.js";
import { RegExpRoute } from "./RegExpRoute.js";
import { Route } from "./Route.js";
import { Serwist, type SerwistOptions } from "./Serwist.js";
import { cacheNames } from "./cacheNames.js";
import type { HTTPMethod } from "./constants.js";
import { copyResponse } from "./copyResponse.js";
import { disableDevLogs } from "./disableDevLogs.js";
import { disableNavigationPreload, enableNavigationPreload, isNavigationPreloadSupported } from "./navigationPreload.js";
import { registerQuotaErrorCallback } from "./registerQuotaErrorCallback.js";
import { setCacheNameDetails } from "./setCacheNameDetails.js";

// Background synchronizing
export {
  BackgroundSyncPlugin,
  BackgroundSyncQueue,
  BackgroundSyncQueueStore,
  StorableRequest,
  type BackgroundSyncQueueOptions,
  type BackgroundSyncQueueEntry,
} from "#lib/backgroundSync/index.js";

// Broadcasting updates
export {
  BroadcastCacheUpdate,
  BroadcastUpdatePlugin,
  BROADCAST_UPDATE_DEFAULT_HEADERS,
  responsesAreSame,
  type BroadcastCacheUpdateOptions,
  type BroadcastPayload,
  type BroadcastPayloadGenerator,
  type BroadcastMessage,
} from "#lib/broadcastUpdate/index.js";

// Setting cacheability criteria
export {
  CacheableResponse,
  CacheableResponsePlugin,
  type CacheableResponseOptions,
} from "#lib/cacheableResponse/index.js";

// Controllers
export { PrecacheStrategy, PrecacheRoute, RuntimeCacheController } from "#lib/controllers/index.js";

// Expiring outdated responses
export {
  CacheExpiration,
  ExpirationPlugin,
  type ExpirationPluginOptions,
} from "#lib/expiration/index.js";

// Google Analytics
export { initializeGoogleAnalytics, type GoogleAnalyticsInitializeOptions } from "#lib/googleAnalytics/index.js";

// Precaching
export {
  PrecacheFallbackPlugin,
  type PrecacheFallbackEntry,
  type PrecacheFallbackPluginOptions,
} from "#lib/precaching/index.js";

// Handling range requests
export {
  createPartialResponse,
  RangeRequestsPlugin,
} from "#lib/rangeRequests/index.js";

// Built-in caching strategies
export {
  CacheFirst,
  CacheOnly,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
  Strategy,
  StrategyHandler,
  type NetworkFirstOptions,
  type NetworkOnlyOptions,
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
export type { HTTPMethod, SerwistOptions, NavigationRouteMatchOptions };
export type * from "./types.js";
