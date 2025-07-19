import type { Require } from "@serwist/utils";
import { privateCacheNames } from "#index.internal";
import type { Precache, PrecacheExtensionOptions, PrecacheOptions } from "./extension.js";
import { PrecacheCacheKeyPlugin } from "./plugin-cache-key.js";
import type { PrecacheRouteOptions } from "./route.js";
import type { PrecacheStrategyOptions } from "./strategy.js";

export const parsePrecacheOptions = (
  controller: Precache,
  {
    entries,
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
  }: PrecacheOptions,
) => ({
  entries: entries ?? [],
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
  extensionOptions: {
    cleanupOutdatedCaches,
    concurrency: concurrency ?? 10,
    navigateFallback,
    navigateFallbackAllowlist,
    navigateFallbackDenylist,
  } satisfies Require<PrecacheExtensionOptions, "concurrency">,
});
