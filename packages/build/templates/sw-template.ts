// We need to treeshake more efficiently
/**
 * Welcome to your Serwist-powered service worker!
 *
 * You'll need to register this file in your web app.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Serwist build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */
import { setCacheNameDetails, clientsClaim, nonNullable } from "@serwist/core";
import { initialize } from "@serwist/google-analytics/initialize";
import { enable } from "@serwist/navigation-preload";
import { PrecacheFallbackPlugin, cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "@serwist/precaching";
// @ts-ignore Let Rollup treeshake unused modules.
import { NetworkFirst, NetworkOnly, CacheFirst, CacheOnly, StaleWhileRevalidate } from "@serwist/strategies";
import { RangeRequestsPlugin } from "@serwist/range-requests";
import { NavigationRoute, registerRoute } from "@serwist/routing";

import type { SerwistSWTemplateOptions } from "../src/types.js";
import { BackgroundSyncPlugin } from "@serwist/background-sync";
import { BroadcastUpdatePlugin } from "@serwist/broadcast-update";
import { CacheableResponsePlugin } from "@serwist/cacheable-response";
import { ExpirationPlugin } from "@serwist/expiration";

declare const self: ServiceWorkerGlobalScope & {
  // self.serwist is like process.env, do NOT dereference.
  // Let Rollup inline all the values.
  serwist: SerwistSWTemplateOptions;
  __WB_DISABLE_DEV_LOGS?: boolean;
};

if (self.serwist.scriptsToImport !== undefined) importScripts(...self.serwist.scriptsToImport);

if (self.serwist.navigationPreload) enable();

if (self.serwist.cacheId) {
  setCacheNameDetails({
    prefix: self.serwist.cacheId,
  });
}

if (self.serwist.shouldSkipWaiting) {
  self.skipWaiting();
} else {
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });
}

if (self.serwist.shouldClientsClaim) clientsClaim();

if (self.serwist.shouldRunPrecacheAndRoute) {
  // The precacheAndRoute() method efficiently caches and responds to
  // requests for URLs in the manifest. See https://goo.gl/S9QRab
  precacheAndRoute(self.serwist.manifestEntries, self.serwist.precacheOptions);

  if (self.serwist.shouldCleanupOutdatedCaches) cleanupOutdatedCaches();

  if (self.serwist.navigateFallback) {
    registerRoute(
      new NavigationRoute(createHandlerBoundToURL(self.serwist.navigateFallback), {
        allowlist: self.serwist.navigateFallbackAllowlist,
        denylist: self.serwist.navigateFallbackDenylist,
      })
    );
  }
}

self.serwist.runtimeCaching.map((entry) => {
  if (typeof entry.handler === "string") {
    const {
      cacheName,
      networkTimeoutSeconds,
      fetchOptions,
      matchOptions,
      plugins,
      backgroundSync,
      broadcastUpdate,
      cacheableResponse,
      expiration,
      precacheFallback,
      rangeRequests,
    } = entry.options!; // entry.options is always defined when entry.handler is of type 'string'.
    let handler;
    switch (entry.handler) {
      case "CacheFirst":
        handler = CacheFirst;
        break;
      case "CacheOnly":
        handler = CacheOnly;
        break;
      case "NetworkFirst":
        handler = NetworkFirst;
        break;
      case "NetworkOnly":
        handler = NetworkOnly;
        break;
      case "StaleWhileRevalidate":
        handler = StaleWhileRevalidate;
        break;
      default: {
        const __exhaustive: never = entry.handler;
        throw new Error(`Unhandled: ${__exhaustive}`);
      }
    }
    registerRoute(
      entry.urlPattern,
      new handler({
        cacheName: cacheName ?? undefined,
        networkTimeoutSeconds,
        fetchOptions,
        matchOptions,
        plugins: [
          ...(plugins ?? []),
          backgroundSync && new BackgroundSyncPlugin(backgroundSync.name, backgroundSync.options),
          broadcastUpdate &&
            new BroadcastUpdatePlugin({
              // @ts-expect-error weird...
              channelName: broadcastUpdate.channelName,
              ...broadcastUpdate.options,
            }),
          cacheableResponse && new CacheableResponsePlugin(cacheableResponse),
          expiration && new ExpirationPlugin(expiration),
          precacheFallback && new PrecacheFallbackPlugin(precacheFallback),
          rangeRequests ? new RangeRequestsPlugin() : undefined,
        ].filter(nonNullable),
      })
    );
  } else {
    registerRoute(entry.urlPattern, entry.handler, entry.method);
  }
});

if (self.serwist.offlineAnalyticsConfig) {
  if (typeof self.serwist.offlineAnalyticsConfig === "object") {
    initialize(self.serwist.offlineAnalyticsConfig);
  } else {
    initialize();
  }
}

if (self.serwist.disableDevLogs) {
  self.__WB_DISABLE_DEV_LOGS = true;
}
