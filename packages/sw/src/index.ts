import type { RuntimeCaching } from "@serwist/build";
import { clientsClaim, setCacheNameDetails } from "@serwist/core";
import { type GoogleAnalyticsInitializeOptions, initialize } from "@serwist/google-analytics/initialize";
import { enable } from "@serwist/navigation-preload";

import { disableDevLogs } from "./disableDevLogs.js";
import type { FallbacksOptions } from "./fallbacks.js";
import { fallbacks } from "./fallbacks.js";
import { handlePrecaching, type HandlePrecachingOptions } from "./handlePrecaching.js";
import { registerRuntimeCaching } from "./registerRuntimeCaching.js";

declare const self: ServiceWorkerGlobalScope;

export type SerwistOptions = HandlePrecachingOptions &
  Partial<FallbacksOptions> & {
    skipWaiting?: boolean;
    importScripts?: string[];
    navigationPreload?: boolean;
    cacheId?: string | undefined;
    clientsClaim?: boolean;
    runtimeCaching?: RuntimeCaching[];
    offlineAnalyticsConfig?: GoogleAnalyticsInitializeOptions | boolean;
    disableDevLogs?: boolean;
  };

export const installSerwist = ({
  precacheEntries,
  precacheOptions,
  cleanupOutdatedCaches,

  skipWaiting: shouldSkipWaiting = false,
  importScripts: scriptsToImport,
  navigationPreload = false,
  cacheId,
  clientsClaim: shouldClaimClients = false,
  runtimeCaching,
  offlineAnalyticsConfig,
  disableDevLogs: shouldDisableDevLogs,
  fallbackEntries,
  fallbackEntriesPrecacheOptions,
  ...options
}: SerwistOptions) => {
  if (!!scriptsToImport && scriptsToImport.length > 0) self.importScripts(...scriptsToImport);

  if (navigationPreload) enable();

  if (cacheId !== undefined)
    setCacheNameDetails({
      prefix: cacheId,
    });

  if (shouldSkipWaiting) {
    self.skipWaiting();
  } else {
    self.addEventListener("message", (event) => {
      if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
      }
    });
  }

  if (shouldClaimClients) clientsClaim();

  handlePrecaching({
    precacheEntries,
    precacheOptions,
    cleanupOutdatedCaches,
    ...(options.navigateFallback && {
      navigateFallback: options.navigateFallback,
      navigateFallbackAllowlist: options.navigateFallbackAllowlist,
      navigateFallbackDenylist: options.navigateFallbackDenylist,
    }),
  });

  if (runtimeCaching !== undefined) {
    if (fallbackEntries !== undefined) {
      runtimeCaching = fallbacks({ runtimeCaching, fallbackEntries, fallbackEntriesPrecacheOptions });
    }
    registerRuntimeCaching(...runtimeCaching);
  }

  if (offlineAnalyticsConfig !== undefined) {
    if (typeof offlineAnalyticsConfig === "boolean") {
      offlineAnalyticsConfig && initialize();
    } else {
      initialize(offlineAnalyticsConfig);
    }
  }

  if (shouldDisableDevLogs) disableDevLogs();
};

export { disableDevLogs, handlePrecaching, registerRuntimeCaching };
