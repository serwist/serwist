import type { HandlerDidErrorCallbackParam } from "@serwist/core";
import { PrecacheFallbackPlugin } from "../plugins/precaching/PrecacheFallbackPlugin.js";
import type { PrecacheFallbackEntry } from "../plugins/precaching/PrecacheFallbackPlugin.js";
import { precacheAndRoute } from "../precaching/precacheAndRoute.js";
import type { PrecacheRouteOptions } from "../precaching/types.js";
import { Strategy } from "../strategies/Strategy.js";
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
 * Note: This function mutates `runtimeCaching`. It also precaches the URLs
 * defined in `entries`, so you must NOT precache any of them beforehand.
 *
 * @see https://serwist.pages.dev/docs/sw/fallbacks
 * @param options
 * @returns The modified `runtimeCaching` array.
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
