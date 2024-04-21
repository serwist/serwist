import { PrecacheController } from "./legacy/PrecacheController.js";
import { PrecacheFallbackPlugin } from "./legacy/PrecacheFallbackPlugin.js";
import type { PrecacheFallbackEntry, PrecacheFallbackPluginOptions } from "./legacy/PrecacheFallbackPlugin.js";
import { PrecacheRoute } from "./legacy/PrecacheRoute.js";
import { Router } from "./legacy/Router.js";
import { addPlugins } from "./legacy/addPlugins.js";
import { addRoute } from "./legacy/addRoute.js";
import { createHandlerBoundToURL } from "./legacy/createHandlerBoundToURL.js";
import type { FallbackEntry, FallbacksOptions } from "./legacy/fallbacks.js";
import { fallbacks } from "./legacy/fallbacks.js";
import { getCacheKeyForURL } from "./legacy/getCacheKeyForURL.js";
import { type HandlePrecachingOptions, handlePrecaching } from "./legacy/handlePrecaching.js";
import type { GoogleAnalyticsInitializeOptions } from "./legacy/initializeGoogleAnalytics.js";
import { initializeGoogleAnalytics } from "./legacy/initializeGoogleAnalytics.js";
import { type InstallSerwistOptions, installSerwist } from "./legacy/installSerwist.js";
import { matchPrecache } from "./legacy/matchPrecache.js";
import { precache } from "./legacy/precache.js";
import { precacheAndRoute } from "./legacy/precacheAndRoute.js";
import { registerRoute } from "./legacy/registerRoute.js";
import { registerRuntimeCaching } from "./legacy/registerRuntimeCaching.js";
import { setCatchHandler } from "./legacy/setCatchHandler.js";
import { setDefaultHandler } from "./legacy/setDefaultHandler.js";
import { getSingletonPrecacheController, setSingletonPrecacheController } from "./legacy/singletonPrecacheController.js";
import { getSingletonRouter, setSingletonRouter } from "./legacy/singletonRouter.js";
import { unregisterRoute } from "./legacy/unregisterRoute.js";

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
