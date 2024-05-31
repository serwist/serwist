/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteMatchCallback, RouteMatchCallbackOptions, SerwistPlugin } from "serwist";
import { CacheableResponsePlugin, Serwist, StaleWhileRevalidate } from "serwist";
import { warmStrategyCache } from "./warmStrategyCache.js";

export interface StaticResourceOptions {
  /**
   * A {@linkcode Serwist} instance.
   */
  serwist: Serwist;
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
export const staticResourceCache = ({
  serwist,
  cacheName = "static-resources",
  matchCallback = ({ request }: RouteMatchCallbackOptions) =>
    request.destination === "style" || request.destination === "script" || request.destination === "worker",
  plugins = [],
  warmCache,
}: StaticResourceOptions): void => {
  plugins.push(
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  );

  const strategy = new StaleWhileRevalidate({
    cacheName,
    plugins,
  });

  serwist.registerCapture(matchCallback, strategy);

  // Warms the cache
  if (warmCache) {
    warmStrategyCache({ urls: warmCache, strategy });
  }
};
