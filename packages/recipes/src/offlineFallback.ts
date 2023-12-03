/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteHandler, RouteHandlerCallbackOptions } from "@serwist/core";
import { matchPrecache } from "@serwist/precaching";
import { setCatchHandler } from "@serwist/routing";

export interface OfflineFallbackOptions {
  /**
   * Precache name to match for page fallbacks. Defaults to offline.html.
   */
  pageFallback?: string;
  /**
   * Precache name to match for image fallbacks.
   */
  imageFallback?: string;
  /**
   * Precache name to match for font fallbacks.
   */
  fontFallback?: string;
}

// Give TypeScript the correct global.
declare let self: ServiceWorkerGlobalScope;

/**
 * An implementation of the [comprehensive fallbacks recipe](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#comprehensive_fallbacks). 
 * Be sure to include the fallbacks in your precache injection.

 * @param options
 */
function offlineFallback(options: OfflineFallbackOptions = {}): void {
  const pageFallback = options.pageFallback || "offline.html";
  const imageFallback = options.imageFallback || false;
  const fontFallback = options.fontFallback || false;

  self.addEventListener("install", (event) => {
    const files = [pageFallback];
    if (imageFallback) {
      files.push(imageFallback);
    }
    if (fontFallback) {
      files.push(fontFallback);
    }

    event.waitUntil(self.caches.open("serwist-offline-fallbacks").then((cache) => cache.addAll(files)));
  });

  const handler: RouteHandler = async (options: RouteHandlerCallbackOptions) => {
    const dest = options.request.destination;
    const cache = await self.caches.open("serwist-offline-fallbacks");

    if (dest === "document") {
      const match = (await matchPrecache(pageFallback)) || (await cache.match(pageFallback));
      return match || Response.error();
    }

    if (dest === "image" && imageFallback !== false) {
      const match = (await matchPrecache(imageFallback)) || (await cache.match(imageFallback));
      return match || Response.error();
    }

    if (dest === "font" && fontFallback !== false) {
      const match = (await matchPrecache(fontFallback)) || (await cache.match(fontFallback));
      return match || Response.error();
    }

    return Response.error();
  };

  setCatchHandler(handler);
}

export { offlineFallback };
