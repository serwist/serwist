import { clientsClaim as clientsClaimImpl } from "#utils/clientsClaim.js";
import type { HTTPMethod } from "./constants.js";
import type { Extension } from "./extension.js";
import { Precache } from "./extensions/index.js";
import { iterateExtensions } from "./functions/handlers.js";
import { enableNavigationPreload } from "./navigation-preload.js";
import type { Route } from "./route.js";
import type { PrecacheEntry, PrecacheOptions, RouteHandlerObject } from "./types.js";
import { disableDevLogs as disableDevLogsImpl, setCacheNameDetails } from "./utils.js";

export interface Serwist {
  readonly routes: Map<HTTPMethod, Route[]>;
  readonly defaultHandlerMap: Map<HTTPMethod, RouteHandlerObject>;
  readonly precache: Precache;
  readonly extensions: Extension[];
  catchHandler?: RouteHandlerObject;
}

export interface SerwistOptions {
  /**
   * Options to customize precaching.
   */
  precache?: PrecacheOptions & {
    entries: (PrecacheEntry | string)[] | undefined;
  };
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
   * Disables Serwist's logging in development mode.
   *
   * @default false
   */
  disableDevLogs?: boolean;
  /**
   * A list of extensions.
   */
  extensions?: Extension[];
}

declare const self: ServiceWorkerGlobalScope;

export const createSerwist = ({
  precache,
  skipWaiting = false,
  importScripts,
  navigationPreload = false,
  cacheId,
  clientsClaim = false,
  disableDevLogs = false,
  extensions = [],
}: SerwistOptions = {}): Serwist => {
  if (importScripts?.length) self.importScripts(...importScripts);

  if (navigationPreload) enableNavigationPreload();

  if (cacheId) setCacheNameDetails({ prefix: cacheId });

  if (skipWaiting) {
    self.skipWaiting();
  } else {
    self.addEventListener("message", (event) => {
      if (event.data?.type === "SKIP_WAITING") {
        self.skipWaiting();
      }
    });
  }

  if (clientsClaim) clientsClaimImpl();

  const precacheExtension = new Precache(precache ?? { entries: [] });

  const routes = new Map<HTTPMethod, Route[]>();

  const defaultHandlerMap = new Map<HTTPMethod, RouteHandlerObject>();

  const exts = [precacheExtension, ...extensions];

  const state: Serwist = {
    get routes() {
      return routes;
    },
    get defaultHandlerMap() {
      return defaultHandlerMap;
    },
    get precache() {
      return precacheExtension;
    },
    get extensions() {
      return exts;
    },
  };

  for (const callback of iterateExtensions(state, "init")) {
    callback({ serwist: state });
  }

  if (disableDevLogs) disableDevLogsImpl();

  return state;
};
