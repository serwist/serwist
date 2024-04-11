import type { HTTPMethod } from "./constants.js";
import { cacheNames } from "./cacheNames.js";
import { cleanupOutdatedCaches } from "./cleanupOutdatedCaches.js";
import { clientsClaim } from "./clientsClaim.js";
import { copyResponse } from "./copyResponse.js";
import { disableDevLogs } from "./disableDevLogs.js";
import { disableNavigationPreload, enableNavigationPreload, isNavigationPreloadSupported } from "./navigationPreload.js";
import type { NavigationRouteMatchOptions } from "./NavigationRoute.js";
import { NavigationRoute } from "./NavigationRoute.js";
import { parseRoute } from "./parseRoute.js";
import { PrecacheRoute } from "./PrecacheRoute.js";
import { PrecacheStrategy } from "./PrecacheStrategy.js";
import { RegExpRoute } from "./RegExpRoute.js";
import { registerQuotaErrorCallback } from "./registerQuotaErrorCallback.js";
import { Route } from "./Route.js";
import { Serwist, type SerwistOptions } from "./Serwist.js";
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
  PrecacheStrategy,
  RegExpRoute,
  registerQuotaErrorCallback,
  Route,
  Serwist,
  setCacheNameDetails,
};
export type { HTTPMethod, NavigationRouteMatchOptions, SerwistOptions };
export type * from "./types.js";
