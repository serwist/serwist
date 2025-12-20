/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteMatchCallback, RouteMatchCallbackOptions, SerwistPlugin } from "serwist";
import { CacheableResponsePlugin, CacheFirst, ExpirationPlugin, type Serwist } from "serwist";
import { warmStrategyCache } from "./warmStrategyCache.js";

export interface ImageCacheOptions {
  /**
   * A {@linkcode Serwist} instance.
   */
  serwist: Serwist;
  /**
   * Name for cache. Defaults to images.
   */
  cacheName?: string;
  /**
   * Serwist callback function to call to match to. Defaults to request.destination === 'image'.
   */
  matchCallback?: RouteMatchCallback;
  /**
   * Maximum age, in seconds, that image entries will be cached for. Defaults to 30 days.
   */
  maxAgeSeconds?: number;
  /**
   * Maximum number of images that will be cached. Defaults to 60.
   */
  maxEntries?: number;
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
 * An implementation of the [image caching recipe](https://developers.google.com/web/tools/workbox/guides/common-recipes#caching_images).
 *
 * @param options
 */
export const imageCache = ({
  serwist,
  cacheName = "images",
  matchCallback = ({ request }: RouteMatchCallbackOptions) => request.destination === "image",
  maxAgeSeconds = 30 * 24 * 60 * 60,
  maxEntries = 60,
  plugins = [],
  warmCache,
}: ImageCacheOptions): void => {
  plugins.push(
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  );
  plugins.push(
    new ExpirationPlugin({
      maxEntries,
      maxAgeSeconds,
    }),
  );

  const strategy = new CacheFirst({
    cacheName,
    plugins,
  });

  serwist.registerCapture(matchCallback, strategy);

  // Warms the cache
  if (warmCache) {
    warmStrategyCache({ urls: warmCache, strategy });
  }
};
