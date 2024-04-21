import { disableDevLogs as disableDevLogsImpl } from "../disableDevLogs.js";
import { enableNavigationPreload } from "../navigationPreload.js";
import { setCacheNameDetails } from "../setCacheNameDetails.js";
import type { RuntimeCaching } from "../types.js";
import { clientsClaim as clientsClaimImpl } from "../utils/clientsClaim.js";
import type { PrecacheController } from "./PrecacheController.js";
import type { Router } from "./Router.js";
import type { FallbacksOptions } from "./fallbacks.js";
import { fallbacks as fallbacksImpl } from "./fallbacks.js";
import { type HandlePrecachingOptions, handlePrecaching } from "./handlePrecaching.js";
import { initializeGoogleAnalytics } from "./initializeGoogleAnalytics.js";
import type { GoogleAnalyticsInitializeOptions } from "./initializeGoogleAnalytics.js";
import { registerRuntimeCaching } from "./registerRuntimeCaching.js";
import { getSingletonPrecacheController } from "./singletonPrecacheController.js";
import { getSingletonRouter } from "./singletonRouter.js";

declare const self: ServiceWorkerGlobalScope;

/**
 * Options for `installSerwist`.
 *
 * @deprecated
 */
export interface InstallSerwistOptions extends Omit<HandlePrecachingOptions, "precacheController" | "router"> {
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
   * Forces the waiting service worker to become the active one.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
   */
  skipWaiting?: boolean;
  /**
   * Imports external scripts. They are executed in the order they
   * are passed.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts
   */
  importScripts?: string[];
  /**
   * Enables navigation preloading if it is supported.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/navigationPreload
   */
  navigationPreload?: boolean;
  /**
   * Modifies the prefix of the default cache names used by Serwist packages.
   */
  cacheId?: string | undefined;
  /**
   * Claims any currently available clients once the service worker
   * becomes active. This is normally used in conjunction with `skipWaiting()`.
   *
   * @default false
   */
  clientsClaim?: boolean;
  /**
   * A list of caching strategies.
   */
  runtimeCaching?: RuntimeCaching[];
  /**
   * Your configuration for `@serwist/google-analytics`. This plugin is
   * only initialized when this option is not `undefined` or `false`.
   */
  offlineAnalyticsConfig?: GoogleAnalyticsInitializeOptions | boolean;
  /**
   * Disables Serwist's logging in development mode.
   *
   * @default false
   */
  disableDevLogs?: boolean;
  /**
   * Precaches routes so that they can be used as a fallback when
   * a Strategy fails to generate a response.
   */
  fallbacks?: Pick<FallbacksOptions, "entries">;
}

/**
 * Abstracts away the core APIs of Serwist.
 *
 * @param options - `installSerwist` options.
 * @deprecated
 */
export const installSerwist = ({
  precacheController = getSingletonPrecacheController(),
  router = getSingletonRouter(),
  precacheEntries,
  precacheOptions,
  cleanupOutdatedCaches,
  navigateFallback,
  navigateFallbackAllowlist,
  navigateFallbackDenylist,
  skipWaiting,
  importScripts,
  navigationPreload = false,
  cacheId,
  clientsClaim = false,
  runtimeCaching,
  offlineAnalyticsConfig,
  disableDevLogs = false,
  fallbacks,
}: InstallSerwistOptions): void => {
  if (!!importScripts && importScripts.length > 0) self.importScripts(...importScripts);

  if (navigationPreload) enableNavigationPreload();

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
    precacheController,
    router,
    precacheEntries,
    precacheOptions,
    cleanupOutdatedCaches,
    navigateFallback,
    navigateFallbackAllowlist,
    navigateFallbackDenylist,
  });

  if (runtimeCaching !== undefined) {
    if (fallbacks !== undefined) {
      runtimeCaching = fallbacksImpl({
        precacheController,
        router,
        runtimeCaching,
        entries: fallbacks.entries,
        precacheOptions,
      });
    }
    registerRuntimeCaching(...runtimeCaching);
  }

  if (offlineAnalyticsConfig !== undefined) {
    if (typeof offlineAnalyticsConfig === "boolean") {
      offlineAnalyticsConfig && initializeGoogleAnalytics({ router });
    } else {
      initializeGoogleAnalytics({
        ...offlineAnalyticsConfig,
        router,
      });
    }
  }

  if (disableDevLogs) disableDevLogsImpl();
};
