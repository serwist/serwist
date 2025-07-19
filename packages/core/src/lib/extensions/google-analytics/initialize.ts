/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { BackgroundSyncPlugin } from "#lib/background-sync/BackgroundSyncPlugin.js";
import type { Serwist } from "#lib/serwist.js";
import { cacheNames as privateCacheNames } from "#utils/cacheNames.js";
import { MAX_RETENTION_TIME, QUEUE_NAME } from "./constants.js";
import {
  createAnalyticsJsRoute,
  createCollectRoutes,
  createGtagJsRoute,
  createGtmJsRoute,
  createOnSyncCallback,
  type GoogleAnalyticsOptions,
} from "./extension.js";

export interface GoogleAnalyticsInitializeOptions extends GoogleAnalyticsOptions {
  serwist: Serwist;
}

/**
 * Initialize Serwist's offline Google Analytics v3 support.
 *
 * @param options
 */
export const initializeGoogleAnalytics = ({ serwist, cacheName, ...options }: GoogleAnalyticsInitializeOptions): void => {
  const resolvedCacheName = privateCacheNames.getGoogleAnalyticsName(cacheName);

  const bgSyncPlugin = new BackgroundSyncPlugin(QUEUE_NAME, {
    maxRetentionTime: MAX_RETENTION_TIME,
    onSync: createOnSyncCallback(options),
  });

  const routes = [
    createGtmJsRoute(resolvedCacheName),
    createAnalyticsJsRoute(resolvedCacheName),
    createGtagJsRoute(resolvedCacheName),
    ...createCollectRoutes(bgSyncPlugin),
  ];

  for (const route of routes) {
    serwist.registerRoute(route);
  }
};
