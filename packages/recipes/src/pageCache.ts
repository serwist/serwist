/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import type { RouteMatchCallback, RouteMatchCallbackOptions, SerwistPlugin } from "@serwist/core";
import { registerRoute } from "@serwist/routing";
import { NetworkFirst } from "@serwist/strategies";

import { warmStrategyCache } from "./warmStrategyCache.js";

export interface PageCacheOptions {
  /**
   * Name for cache. Defaults to pages.
   */
  cacheName?: string;
  /**
   * Serwist callback function to call to match to. Defaults to request.mode === 'navigate'.
   */
  matchCallback?: RouteMatchCallback;
  /**
   * Maximum amount of time, in seconds, to wait on the network before falling back to cache.
   *
   * @default 3
   */
  networkTimeoutSeconds?: number;
  /**
   * Additional plugins to use for this recipe.
   */
  plugins?: SerwistPlugin[];
  /**
   * Paths to call to use to warm this cache
   */
  warmCache?: string[];
}

/**
 * An implementation of a page caching recipe with a network timeout.
 *
 * @param options
 */
function pageCache(options: PageCacheOptions = {}): void {
  const defaultMatchCallback = ({ request }: RouteMatchCallbackOptions) => request.mode === "navigate";

  const cacheName = options.cacheName || "pages";
  const matchCallback = options.matchCallback || defaultMatchCallback;
  const networkTimeoutSeconds = options.networkTimeoutSeconds || 3;
  const plugins = options.plugins || [];
  plugins.push(
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  );

  const strategy = new NetworkFirst({
    networkTimeoutSeconds,
    cacheName,
    plugins,
  });

  // Registers the route
  registerRoute(matchCallback, strategy);

  // Warms the cache
  if (options.warmCache) {
    warmStrategyCache({ urls: options.warmCache, strategy });
  }
}

export { pageCache };
