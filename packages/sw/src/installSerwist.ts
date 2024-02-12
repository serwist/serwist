import { clientsClaim as clientsClaimImpl, setCacheNameDetails } from "@serwist/core";
import { logger } from "@serwist/core/internal";
import { type GoogleAnalyticsInitializeOptions, initialize } from "@serwist/google-analytics/initialize";
import { enable } from "@serwist/navigation-preload";

import { disableDevLogs as disableDevLogsImpl } from "./disableDevLogs.js";
import type { FallbacksOptions } from "./fallbacks.js";
import { fallbacks as fallbacksImpl } from "./fallbacks.js";
import { type HandlePrecachingOptions, handlePrecaching } from "./handlePrecaching.js";
import { registerRuntimeCaching } from "./registerRuntimeCaching.js";
import type { RuntimeCaching } from "./types.js";

declare const self: ServiceWorkerGlobalScope;

export type InstallSerwistOptions = HandlePrecachingOptions & {
  skipWaiting?: boolean;
  importScripts?: string[];
  navigationPreload?: boolean;
  cacheId?: string | undefined;
  clientsClaim?: boolean;
  runtimeCaching?: RuntimeCaching[];
  offlineAnalyticsConfig?: GoogleAnalyticsInitializeOptions | boolean;
  disableDevLogs?: boolean;
  fallbacks?: Omit<FallbacksOptions, "runtimeCaching">;
};

/**
 * A function that abstracts away the core APIs of Serwist.
 * @param options - `installSerwist` options.
 */
export const installSerwist = ({
  precacheEntries,
  precacheOptions,
  cleanupOutdatedCaches,

  skipWaiting = false,
  importScripts,
  navigationPreload = false,
  cacheId,
  clientsClaim = false,
  runtimeCaching,
  offlineAnalyticsConfig,
  disableDevLogs,
  fallbacks,
  ...options
}: InstallSerwistOptions) => {
  if (!!importScripts && importScripts.length > 0) self.importScripts(...importScripts);

  if (navigationPreload) enable();

  if (cacheId !== undefined) {
    setCacheNameDetails({
      prefix: cacheId,
    });
  }

  if (skipWaiting) {
    self.skipWaiting();
  } else {
    self.addEventListener("message", (event) => {
      if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
      }
    });
  }

  if (clientsClaim) clientsClaimImpl();

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
    if (!("__WB_FORCE_RUNTIME_CACHING" in globalThis)) {
      self.__WB_FORCE_RUNTIME_CACHING = false;
    }
    if (!self.__WB_FORCE_RUNTIME_CACHING && process.env.NODE_ENV !== "production") {
      logger.log("runtimeCaching and fallbacks are disabled in development mode.");
    } else {
      if (fallbacks !== undefined) {
        runtimeCaching = fallbacksImpl({
          ...fallbacks,
          runtimeCaching,
        });
      }
      registerRuntimeCaching(...runtimeCaching);
    }
  }

  if (offlineAnalyticsConfig !== undefined) {
    if (typeof offlineAnalyticsConfig === "boolean") {
      offlineAnalyticsConfig && initialize();
    } else {
      initialize(offlineAnalyticsConfig);
    }
  }

  if (disableDevLogs) disableDevLogsImpl();
};
