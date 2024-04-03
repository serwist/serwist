/*
  Copyright 2020 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { RouteHandler, RouteHandlerCallbackOptions } from "@serwist/core";
import { type PrecacheController, getSingletonPrecacheController } from "@serwist/sw/precaching";
import { type Router, getSingletonRouter } from "@serwist/sw/routing";

export interface OfflineFallbackOptions {
  /**
   * An optional `PrecacheController` instance. If not provided, the singleton
   * `PrecacheController` will be used.
   */
  precacheController?: PrecacheController;
  /**
   * An optional `Router` instance. If not provided, the singleton `Router`
   * will be used.
   */
  router?: Router;
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
export const offlineFallback = ({
  precacheController = getSingletonPrecacheController(),
  router = getSingletonRouter(),
  pageFallback = "offline.html",
  imageFallback,
  fontFallback,
}: OfflineFallbackOptions = {}): void => {
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
      const match = (await precacheController.matchPrecache(pageFallback)) || (await cache.match(pageFallback));
      return match || Response.error();
    }

    if (dest === "image" && imageFallback !== undefined) {
      const match = (await precacheController.matchPrecache(imageFallback)) || (await cache.match(imageFallback));
      return match || Response.error();
    }

    if (dest === "font" && fontFallback !== undefined) {
      const match = (await precacheController.matchPrecache(fontFallback)) || (await cache.match(fontFallback));
      return match || Response.error();
    }

    return Response.error();
  };

  router.setCatchHandler(handler);
};
