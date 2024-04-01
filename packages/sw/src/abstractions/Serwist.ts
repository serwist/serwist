import { clientsClaim as clientsClaimImpl, setCacheNameDetails } from "@serwist/core";
import { type GoogleAnalyticsInitializeOptions, initialize } from "../plugins/googleAnalytics/initialize.js";
import { PrecacheController } from "../precaching/PrecacheController.js";
import { PrecacheRoute } from "../precaching/PrecacheRoute.js";
import { cleanupOutdatedCaches as cleanupOutdatedCachesImpl } from "../precaching/cleanupOutdatedCaches.js";
import { createHandlerBoundToURL } from "../precaching/createHandlerBoundToURL.js";
import { getSingletonPrecacheController } from "../precaching/singletonPrecacheController.js";
import { NavigationRoute } from "../routing/NavigationRoute.js";
import { Router } from "../routing/Router.js";
import { parseRoute } from "../routing/parseRoute.js";
import { getSingletonRouter } from "../routing/singletonRouter.js";
import { disableDevLogs as disableDevLogsImpl } from "./disableDevLogs.js";
import { fallbacks as fallbacksImpl } from "./fallbacks.js";
import type { FallbacksOptions } from "./fallbacks.js";
import { type HandlePrecachingOptions } from "./handlePrecaching.js";
import { enableNavigationPreload } from "./navigationPreload.js";
import type { RuntimeCaching } from "./types.js";

declare const self: ServiceWorkerGlobalScope;

export interface SerwistOptions {
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
}

export interface SerwistInstallOptions extends HandlePrecachingOptions {
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
   *
   * @see https://serwist.pages.dev/docs/sw/runtime-caching
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
   * Note: This option mutates `runtimeCaching`!
   *
   * @see https://serwist.pages.dev/docs/sw/fallbacks
   */
  fallbacks?: Omit<FallbacksOptions, "runtimeCaching">;
}

export class Serwist {
  private _precacheController: PrecacheController;
  private _router: Router;
  constructor({ precacheController, router }: SerwistOptions = {}) {
    this._precacheController = precacheController || getSingletonPrecacheController();
    this._router = router || getSingletonRouter();
  }
  install({
    precacheEntries,
    precacheOptions,
    cleanupOutdatedCaches,
    navigateFallback,
    navigateFallbackAllowlist,
    navigateFallbackDenylist,
    skipWaiting = false,
    importScripts,
    navigationPreload = false,
    cacheId,
    clientsClaim = false,
    runtimeCaching,
    offlineAnalyticsConfig,
    disableDevLogs = false,
    fallbacks,
  }: SerwistInstallOptions = {}) {
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

    if (!!precacheEntries && precacheEntries.length > 0) {
      /**
       * The precacheAndRoute() method efficiently caches and responds to
       * requests for URLs in the manifest.
       * See https://goo.gl/S9QRab
       */
      this._precacheController.precache(precacheEntries);
      this._router.registerRoute(new PrecacheRoute(this._precacheController, precacheOptions));

      if (cleanupOutdatedCaches) cleanupOutdatedCachesImpl();

      if (navigateFallback) {
        this._router.registerRoute(
          new NavigationRoute(createHandlerBoundToURL(navigateFallback), {
            allowlist: navigateFallbackAllowlist,
            denylist: navigateFallbackDenylist,
          }),
        );
      }
    }

    if (offlineAnalyticsConfig !== undefined) {
      if (typeof offlineAnalyticsConfig === "boolean") {
        offlineAnalyticsConfig && initialize();
      } else {
        initialize(offlineAnalyticsConfig);
      }
    }
    if (runtimeCaching !== undefined) {
      if (fallbacks !== undefined) {
        fallbacksImpl({ ...fallbacks, runtimeCaching });
      }
      for (const entry of runtimeCaching) {
        this._router.registerRoute(parseRoute(entry.matcher, entry.handler, entry.method));
      }
    }

    if (disableDevLogs) disableDevLogsImpl();
  }
}
