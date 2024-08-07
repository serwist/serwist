import { privateCacheNames } from "../index.internal.js";
import type { PrecacheStrategyOptions } from "../lib/strategies/PrecacheStrategy.js";
import type { Serwist } from "../Serwist.js";
import type { PrecacheOptions, PrecacheRouteOptions } from "../types.js";
import { PrecacheCacheKeyPlugin } from "./PrecacheCacheKeyPlugin.js";

export const parsePrecacheOptions = (serwist: Serwist, precacheOptions: PrecacheOptions = {}) => {
  const {
    cacheName: precacheCacheName,
    plugins: precachePlugins = [],
    fetchOptions: precacheFetchOptions,
    matchOptions: precacheMatchOptions,
    fallbackToNetwork: precacheFallbackToNetwork,
    directoryIndex: precacheDirectoryIndex,
    ignoreURLParametersMatching: precacheIgnoreUrls,
    cleanURLs: precacheCleanUrls,
    urlManipulation: precacheUrlManipulation,
    cleanupOutdatedCaches,
    concurrency = 10,
    navigateFallback,
    navigateFallbackAllowlist,
    navigateFallbackDenylist,
  } = precacheOptions ?? {};

  return {
    precacheStrategyOptions: {
      cacheName: privateCacheNames.getPrecacheName(precacheCacheName),
      plugins: [...precachePlugins, new PrecacheCacheKeyPlugin({ precacheController: serwist })],
      fetchOptions: precacheFetchOptions,
      matchOptions: precacheMatchOptions,
      fallbackToNetwork: precacheFallbackToNetwork,
    } satisfies PrecacheStrategyOptions,
    precacheRouteOptions: {
      directoryIndex: precacheDirectoryIndex,
      ignoreURLParametersMatching: precacheIgnoreUrls,
      cleanURLs: precacheCleanUrls,
      urlManipulation: precacheUrlManipulation,
    } satisfies PrecacheRouteOptions,
    precacheMiscOptions: {
      cleanupOutdatedCaches,
      concurrency,
      navigateFallback,
      navigateFallbackAllowlist,
      navigateFallbackDenylist,
    },
  };
};
