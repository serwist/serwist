import type { PrecacheStrategyOptions } from "./PrecacheStrategy.js";
import type { PrecacheControllerOptions, PrecacheOptions, PrecacheRouteOptions } from "./PrecacheController.js";

export const parsePrecacheOptions = ({
  cacheName,
  plugins,
  fetchOptions,
  matchOptions,
  fallbackToNetwork,
  directoryIndex,
  ignoreURLParametersMatching,
  cleanURLs,
  urlManipulation,
  cleanupOutdatedCaches,
  concurrency,
  navigateFallback,
  navigateFallbackAllowlist,
  navigateFallbackDenylist,
}: PrecacheOptions = {}) => ({
  strategyOptions: {
    cacheName,
    plugins,
    fetchOptions,
    matchOptions,
    fallbackToNetwork,
  } satisfies PrecacheStrategyOptions,
  routeOptions: {
    directoryIndex,
    ignoreURLParametersMatching,
    cleanURLs,
    urlManipulation,
  } satisfies PrecacheRouteOptions,
  controllerOptions: {
    cleanupOutdatedCaches,
    concurrency,
    navigateFallback,
    navigateFallbackAllowlist,
    navigateFallbackDenylist,
  } satisfies PrecacheControllerOptions,
});
