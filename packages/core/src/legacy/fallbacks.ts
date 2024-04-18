import { Strategy } from "../lib/strategies/Strategy.js";
import type { PrecacheRouteOptions, RuntimeCaching } from "../types.js";
import type { PrecacheController } from "./PrecacheController.js";
import { PrecacheFallbackPlugin } from "./PrecacheFallbackPlugin.js";
import type { PrecacheFallbackEntry } from "./PrecacheFallbackPlugin.js";
import { PrecacheRoute } from "./PrecacheRoute.js";
import type { Router } from "./Router.js";
import { getSingletonPrecacheController } from "./singletonPrecacheController.js";
import { getSingletonRouter } from "./singletonRouter.js";

export interface FallbackEntry extends PrecacheFallbackEntry {
  /**
   * The revision used for precaching.
   */
  revision: string;
}

export interface FallbacksOptions {
  /**
   * A list of fallback entries.
   */
  entries: FallbackEntry[];
  /**
   * Precache options that will be used for your
   * fallback entries.
   */
  precacheOptions?: PrecacheRouteOptions;
}

export interface FallbacksOptions {
  /**
   * An optional `PrecacheController` instance. If not provided, the singleton
   * `PrecacheController` will be used.
   */
  precacheController?: PrecacheController;
  /**
   * An optional `Router` instance. If not provided, the singleton `Router`
   * will be used.
   */
  router?: Router;
  /**
   * Your previous list of caching strategies.
   */
  runtimeCaching: RuntimeCaching[];
  /**
   * A list of fallback entries.
   */
  entries: FallbackEntry[];
  /**
   * Precache options that will be used for your
   * fallback entries.
   */
  precacheOptions?: PrecacheRouteOptions;
}

/**
 * Precaches routes so that they can be used as a fallback when
 * a Strategy fails to generate a response.
 *
 * Note: This function mutates `runtimeCaching`. It also precaches the URLs
 * defined in `entries`, so you must NOT precache any of them beforehand.
 *
 * @param options
 * @returns The modified `runtimeCaching` array.
 * @deprecated
 */
export const fallbacks = ({
  precacheController = getSingletonPrecacheController(),
  router = getSingletonRouter(),
  runtimeCaching,
  entries,
  precacheOptions,
}: FallbacksOptions): RuntimeCaching[] => {
  precacheController.precache(entries);
  router.registerRoute(new PrecacheRoute(precacheController, precacheOptions));

  const fallbackPlugin = new PrecacheFallbackPlugin({
    fallbackUrls: entries,
  });

  runtimeCaching.forEach((cacheEntry) => {
    if (
      cacheEntry.handler instanceof Strategy &&
      // PrecacheFallbackPlugin also has `handlerDidError`, so we don't need to check for its instances.
      !cacheEntry.handler.plugins.some((plugin) => "handlerDidError" in plugin)
    ) {
      cacheEntry.handler.plugins.push(fallbackPlugin);
    }

    return cacheEntry;
  });

  return runtimeCaching;
};
