import { clientsClaim as clientsClaimImpl, setCacheNameDetails } from "@serwist/core";
import { type GoogleAnalyticsInitializeOptions, initialize } from "@serwist/google-analytics/initialize";
import { enable } from "@serwist/navigation-preload";
import { PrecacheController, PrecacheRoute, cleanupOutdatedCaches as cleanupOutdatedCachesImpl, createHandlerBoundToURL } from "@serwist/precaching";
import { NavigationRoute, Router } from "@serwist/routing";
import { parseRoute } from "@serwist/routing/internal";
import { disableDevLogs as disableDevLogsImpl } from "./disableDevLogs.js";
import { fallbacks as fallbacksImpl } from "./fallbacks.js";
import type { FallbacksOptions } from "./fallbacks.js";
import { type HandlePrecachingOptions } from "./handlePrecaching.js";
import type { RuntimeCaching } from "./types.js";

declare const self: ServiceWorkerGlobalScope;

export interface SerwistOptions {
  /**
   * The precache controller that will be used to perform efficient
   * precaching of assets.
   * @default
   * ```js
   * new PrecacheController()
   * ```
   * @see https://serwist.pages.dev/docs/sw/precache-controller
   */
  precacheController?: PrecacheController;
  /**
   * The router that will be used to process a `FetchEvent`, responding
   * with a `Response` if a matching route exists.
   *
   * @default
   * ```js
   * new Router()
   * ```
   * @see https://serwist.pages.dev/docs/sw/router
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
   * @default falseOmit<SerwistOptions, "precacheController">
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
  constructor({ precacheController = new PrecacheController(), router = new Router() }: SerwistOptions = {}) {
    this._precacheController = precacheController;
    this._router = router;
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
  }: SerwistInstallOptions) {
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
