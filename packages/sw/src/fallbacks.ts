import type { HandlerDidErrorCallbackParam } from "@serwist/core";
import type { PrecacheRouteOptions } from "@serwist/precaching";
import { PrecacheFallbackPlugin, precacheAndRoute } from "@serwist/precaching";
import type { PrecacheFallbackEntry } from "@serwist/precaching";

import { Strategy } from "@serwist/strategies";
import type { RuntimeCaching } from "./types.js";

export type FallbackMatcher = (_: HandlerDidErrorCallbackParam) => boolean;

export interface FallbackEntry extends PrecacheFallbackEntry {
  /**
   * The revision used for precaching.
   */
  revision: string;
}

export interface FallbacksOptions {
  /**
   * Your previous `RuntimeCaching` array.
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
 * Note: This function mutates `runtimeCaching`!
 *
 * @see https://serwist.pages.dev/docs/sw/fallbacks
 * @param options
 * @returns The modified `RuntimeCaching` array. Using this value
 * is not needed, as it is simply the array in `options`.
 */
export const fallbacks = ({ runtimeCaching, entries, precacheOptions }: FallbacksOptions): RuntimeCaching[] => {
  precacheAndRoute(entries, precacheOptions);

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
