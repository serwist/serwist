import { Strategy } from "$lib/strategies/legacy/strategy.js";
import type { PrecacheRouteOptions, RuntimeCaching } from "$lib/types.js";
import type { PrecacheController } from "./precache-controller.js";
import type { PrecacheFallbackEntry } from "./precache-fallback-plugin.js";
import { PrecacheFallbackPlugin } from "./precache-fallback-plugin.js";
import { PrecacheRoute } from "./precache-route.js";
import type { Router } from "./router.js";
import { getSingletonPrecacheController } from "./singleton-precache-controller.js";
import { getSingletonRouter } from "./singleton-router.js";

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
   * An optional {@linkcode PrecacheController} instance. If not provided, the singleton
   * {@linkcode PrecacheController} will be used.
   */
  precacheController?: PrecacheController;
  /**
   * An optional {@linkcode Router} instance. If not provided, the singleton {@linkcode Router}
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
  });

  return runtimeCaching;
};
