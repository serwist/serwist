import { addPlugins } from "./legacy/add-plugins.js";
import { addRoute } from "./legacy/add-route.js";
import { createHandlerBoundToURL } from "./legacy/create-handler-bound-to-url.js";
import type { FallbackEntry, FallbacksOptions } from "./legacy/fallbacks.js";
import { fallbacks } from "./legacy/fallbacks.js";
import { getCacheKeyForURL } from "./legacy/get-cache-key-for-url.js";
import { type HandlePrecachingOptions, handlePrecaching } from "./legacy/handle-precaching.js";
import type { GoogleAnalyticsInitializeOptions } from "./legacy/initialize-google-analytics.js";
import { initializeGoogleAnalytics } from "./legacy/initialize-google-analytics.js";
import { type InstallSerwistOptions, installSerwist } from "./legacy/install-serwist.js";
import { matchPrecache } from "./legacy/match-precache.js";
import { PrecacheController } from "./legacy/precache-controller.js";
import type { PrecacheFallbackEntry, PrecacheFallbackPluginOptions } from "./legacy/precache-fallback-plugin.js";
import { PrecacheFallbackPlugin } from "./legacy/precache-fallback-plugin.js";
import { PrecacheRoute } from "./legacy/precache-route.js";
import { precache } from "./legacy/precache.js";
import { precacheAndRoute } from "./legacy/precache-and-route.js";
import { Router } from "./legacy/router.js";
import { registerRoute } from "./legacy/register-route.js";
import { registerRuntimeCaching } from "./legacy/register-runtime-caching.js";
import { setCatchHandler } from "./legacy/set-catch-handler.js";
import { setDefaultHandler } from "./legacy/set-default-handler.js";
import { getSingletonPrecacheController, setSingletonPrecacheController } from "./legacy/singleton-precache-controller.js";
import { getSingletonRouter, setSingletonRouter } from "./legacy/singleton-router.js";
import { unregisterRoute } from "./legacy/unregister-route.js";

export {
  // Actual deprecated modules start here
  addPlugins,
  addRoute,
  createHandlerBoundToURL,
  fallbacks,
  getCacheKeyForURL,
  initializeGoogleAnalytics,
  installSerwist,
  matchPrecache,
  precache,
  precacheAndRoute,
  PrecacheController,
  PrecacheFallbackPlugin,
  PrecacheRoute,
  getSingletonPrecacheController,
  setSingletonPrecacheController,
  handlePrecaching,
  registerRuntimeCaching,
  registerRoute,
  Router,
  setCatchHandler,
  setDefaultHandler,
  getSingletonRouter,
  setSingletonRouter,
  unregisterRoute,
};
export type {
  HandlePrecachingOptions,
  GoogleAnalyticsInitializeOptions,
  InstallSerwistOptions,
  FallbackEntry,
  FallbacksOptions,
  PrecacheFallbackEntry,
  PrecacheFallbackPluginOptions,
};
