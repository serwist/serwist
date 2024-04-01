/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { CacheableResponsePlugin, ExpirationPlugin } from "@serwist/sw/plugins";
import { type Router, getSingletonRouter } from "@serwist/sw/routing";
import { CacheFirst, StaleWhileRevalidate } from "@serwist/sw/strategies";

export interface GoogleFontCacheOptions {
  /**
   * An optional `Router` instance. If not provided, the singleton `Router`
   * will be used.
   */
  router?: Router;
  /**
   * Cache prefix for caching stylesheets and webfonts. Defaults to google-fonts.
   */
  cachePrefix?: string;
  /**
   * Maximum age, in seconds, that font entries will be cached for. Defaults to 1 year.
   */
  maxAgeSeconds?: number;
  /**
   * Maximum number of fonts that will be cached. Defaults to 30.
   */
  maxEntries?: number;
}

/**
 * An implementation of the [Google fonts](https://developers.google.com/web/tools/workbox/guides/common-recipes#google_fonts) caching recipe.
 *
 * @param options
 */
export const googleFontsCache = ({
  router = getSingletonRouter(),
  cachePrefix = "google-fonts",
  maxAgeSeconds = 60 * 60 * 24 * 365,
  maxEntries = 30,
}: GoogleFontCacheOptions = {}): void => {
  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  router.registerCapture(
    ({ url }) => url.origin === "https://fonts.googleapis.com",
    new StaleWhileRevalidate({
      cacheName: `${cachePrefix}-stylesheets`,
    }),
  );

  // Cache the underlying font files with a cache-first strategy for 1 year.
  router.registerCapture(
    ({ url }) => url.origin === "https://fonts.gstatic.com",
    new CacheFirst({
      cacheName: `${cachePrefix}-webfonts`,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxAgeSeconds,
          maxEntries,
        }),
      ],
    }),
  );
};
