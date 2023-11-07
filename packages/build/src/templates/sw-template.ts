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
import { setCacheNameDetails, clientsClaim } from "@serwist/core";
import { enable } from "@serwist/navigation-preload";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
  PrecacheRouteOptions,
} from "@serwist/precaching";
import { NavigationRoute, registerRoute } from "@serwist/routing";

import { ManifestEntry } from "../types.js";
import { initialize, type GoogleAnalyticsInitializeOptions } from "@serwist/google-analytics/initialize";

interface SerwistSWTemplateOptions {
  skipWaiting: boolean;
  importScripts: string[];
  navigationPreload: boolean;
  cacheId: string | undefined;
  clientsClaim: boolean;
  manifestEntries: ManifestEntry[];
  precacheOptions: PrecacheRouteOptions;
  cleanupOutdatedCaches: boolean;
  navigateFallback: string | undefined;
  navigateFallbackAllowlist: RegExp[];
  navigateFallbackDenylist: RegExp[];
  offlineAnalyticsConfig: GoogleAnalyticsInitializeOptions;
  disableDevLogs: boolean;
}

declare const self: ServiceWorkerGlobalScope & {
  serwist: SerwistSWTemplateOptions;
  __WB_DISABLE_DEV_LOGS?: boolean;
};

const {
  skipWaiting: shouldSkipWaiting = false,
  importScripts: scriptsToImport,
  navigationPreload = false,
  cacheId,
  clientsClaim: shouldClientsClaim = true,
  manifestEntries,
  precacheOptions,
  cleanupOutdatedCaches: shouldCleanupOutdatedCaches = false,
  navigateFallback,
  navigateFallbackAllowlist,
  navigateFallbackDenylist,
  offlineAnalyticsConfig,
  disableDevLogs = false,
} = self.serwist;

if (scriptsToImport !== undefined) importScripts(...scriptsToImport);

if (navigationPreload) enable();

if (cacheId) {
  setCacheNameDetails({
    prefix: cacheId,
  });
}

if (shouldSkipWaiting) {
  self.skipWaiting();
} else {
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });
}

if (shouldClientsClaim) clientsClaim();

if (Array.isArray(manifestEntries) && manifestEntries.length > 0) {
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  precacheAndRoute(manifestEntries, precacheOptions);

  if (shouldCleanupOutdatedCaches) cleanupOutdatedCaches();

  if (navigateFallback) {
    registerRoute(
      new NavigationRoute(createHandlerBoundToURL(navigateFallback), {
        allowlist: navigateFallbackAllowlist,
        denylist: navigateFallbackDenylist,
      })
    );
  }
}

// <% if (runtimeCaching) { runtimeCaching.forEach(runtimeCachingString => {%><%= runtimeCachingString %><% });} %>

if (offlineAnalyticsConfig) initialize(offlineAnalyticsConfig);

if (disableDevLogs) { self.__WB_DISABLE_DEV_LOGS = true; }
