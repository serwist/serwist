import type { NavigationRouteMatchOptions } from "./NavigationRoute.js";
import { NavigationRoute } from "./NavigationRoute.js";
import { PrecacheRoute } from "./PrecacheRoute.js";
import { RegExpRoute } from "./RegExpRoute.js";
import { Route } from "./Route.js";
import { Serwist, type SerwistOptions } from "./Serwist.js";
import { cacheNames } from "./cacheNames.js";
import { cleanupOutdatedCaches } from "./cleanupOutdatedCaches.js";
import { clientsClaim } from "./clientsClaim.js";
import type { HTTPMethod } from "./constants.js";
import { copyResponse } from "./copyResponse.js";
import { disableDevLogs } from "./disableDevLogs.js";
import { disableNavigationPreload, enableNavigationPreload, isNavigationPreloadSupported } from "./navigationPreload.js";
import { parseRoute } from "./parseRoute.js";
import { registerQuotaErrorCallback } from "./registerQuotaErrorCallback.js";
import { setCacheNameDetails } from "./setCacheNameDetails.js";

export {
  NavigationRoute,
  cacheNames,
  cleanupOutdatedCaches,
  clientsClaim,
  copyResponse,
  disableDevLogs,
  disableNavigationPreload,
  enableNavigationPreload,
  isNavigationPreloadSupported,
  parseRoute,
  PrecacheRoute,
  RegExpRoute,
  registerQuotaErrorCallback,
  Route,
  Serwist,
  setCacheNameDetails,
};
export type { HTTPMethod, NavigationRouteMatchOptions, SerwistOptions };
export type * from "./types.js";
