/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import type {
  RouteMatchCallback,
  RouteMatchCallbackOptions,
  SerwistPlugin,
} from "@serwist/core";
import { registerRoute } from "@serwist/routing";
import { StaleWhileRevalidate } from "@serwist/strategies";

import { warmStrategyCache } from "./warmStrategyCache.js";

export interface StaticResourceOptions {
  /**
   * Name for cache.
   * 
   * @default "static-resources"
   */
  cacheName?: string;
  /**
   * Serwist callback function to call to match to.
   * 
   * @default request.destination === 'style' || request.destination === 'script' || request.destination === 'worker'
   */
  matchCallback?: RouteMatchCallback;
  /**
   * Additional plugins to use for this recipe.
   */
  plugins?: SerwistPlugin[];
  /**
   * Paths to call to use to warm this cache.
   */
  warmCache?: string[];
}

/**
 * An implementation of the [CSS and JavaScript files recipe](https://developers.google.com/web/tools/workbox/guides/common-recipes#cache_css_and_javascript_files).
 *
 * @param options
 */
function staticResourceCache(options: StaticResourceOptions = {}): void {
  const defaultMatchCallback = ({ request }: RouteMatchCallbackOptions) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker";

  const cacheName = options.cacheName || "static-resources";
  const matchCallback = options.matchCallback || defaultMatchCallback;
  const plugins = options.plugins || [];
  plugins.push(
    new CacheableResponsePlugin({
      statuses: [0, 200],
    })
  );

  const strategy = new StaleWhileRevalidate({
    cacheName,
    plugins,
  });

  registerRoute(matchCallback, strategy);

  // Warms the cache
  if (options.warmCache) {
    warmStrategyCache({ urls: options.warmCache, strategy });
  }
}

export { staticResourceCache };
