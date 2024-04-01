/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteMatchCallback, RouteMatchCallbackOptions, SerwistPlugin } from "@serwist/core";
import { CacheableResponsePlugin } from "@serwist/sw/plugins";
import { type Router, getSingletonRouter } from "@serwist/sw/routing";
import { NetworkFirst } from "@serwist/sw/strategies";
import { warmStrategyCache } from "./warmStrategyCache.js";

export interface PageCacheOptions {
  /**
   * An optional `Router` instance. If not provided, the singleton `Router`
   * will be used.
   */
  router?: Router;
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
export const pageCache = ({
  router = getSingletonRouter(),
  cacheName = "pages",
  matchCallback = ({ request }: RouteMatchCallbackOptions) => request.mode === "navigate",
  networkTimeoutSeconds = 3,
  plugins = [],
  warmCache,
}: PageCacheOptions = {}): void => {
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
  router.registerCapture(matchCallback, strategy);

  // Warms the cache
  if (warmCache) {
    warmStrategyCache({ urls: warmCache, strategy });
  }
};
