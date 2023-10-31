/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import "./_version.js";

import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import { ExpirationPlugin } from "@serwist/expiration";
import { registerRoute } from "@serwist/routing";
import { CacheFirst, StaleWhileRevalidate } from "@serwist/strategies";

export interface GoogleFontCacheOptions {
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
function googleFontsCache(options: GoogleFontCacheOptions = {}): void {
  const sheetCacheName = `${options.cachePrefix || "google-fonts"}-stylesheets`;
  const fontCacheName = `${options.cachePrefix || "google-fonts"}-webfonts`;
  const maxAgeSeconds = options.maxAgeSeconds || 60 * 60 * 24 * 365;
  const maxEntries = options.maxEntries || 30;

  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  registerRoute(
    ({ url }) => url.origin === "https://fonts.googleapis.com",
    new StaleWhileRevalidate({
      cacheName: sheetCacheName,
    })
  );

  // Cache the underlying font files with a cache-first strategy for 1 year.
  registerRoute(
    ({ url }) => url.origin === "https://fonts.gstatic.com",
    new CacheFirst({
      cacheName: fontCacheName,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxAgeSeconds,
          maxEntries,
        }),
      ],
    })
  );
}

export { googleFontsCache };
