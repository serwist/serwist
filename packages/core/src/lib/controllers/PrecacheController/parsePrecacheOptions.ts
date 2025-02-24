import type { Require } from "@serwist/utils";
import { privateCacheNames } from "$index.internal";
import type { PrecacheStrategyOptions } from "./PrecacheStrategy.js";
import type { PrecacheController, PrecacheControllerOptions, PrecacheOptions, PrecacheRouteOptions } from "./PrecacheController.js";
import { PrecacheCacheKeyPlugin } from "./PrecacheCacheKeyPlugin.js";

export const parsePrecacheOptions = (
  controller: PrecacheController,
  {
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
  }: PrecacheOptions = {},
) => ({
  strategyOptions: {
    cacheName: privateCacheNames.getPrecacheName(cacheName),
    plugins: [...(plugins ?? []), new PrecacheCacheKeyPlugin({ precacheController: controller })],
    fetchOptions,
    matchOptions,
    fallbackToNetwork,
  } satisfies Require<PrecacheStrategyOptions, "cacheName" | "plugins">,
  routeOptions: {
    directoryIndex,
    ignoreURLParametersMatching,
    cleanURLs,
    urlManipulation,
  } satisfies PrecacheRouteOptions,
  controllerOptions: {
    cleanupOutdatedCaches,
    concurrency: concurrency ?? 10,
    navigateFallback,
    navigateFallbackAllowlist,
    navigateFallbackDenylist,
  } satisfies Require<PrecacheControllerOptions, "concurrency">,
});
