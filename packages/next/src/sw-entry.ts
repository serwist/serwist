import { Serwist } from "@serwist/window";

import type { SerwistNextOptions } from "./internal-types.js";
import type { MessageType } from "./sw-entry-worker.js";

declare global {
  interface Window {
    serwist: Serwist;
  }
}
declare const self: Window &
  typeof globalThis & {
    // Do not dereference this, use its attributes directly or assign them to other variables.
    // You should do the latter if you use an attribute multiple times.
    __SERWIST_SW_ENTRY: SerwistNextOptions;
  };

if (typeof window !== "undefined" && "serviceWorker" in navigator && typeof caches !== "undefined") {
  let swEntryWorker: Worker | undefined;

  if (self.__SERWIST_SW_ENTRY.swEntryWorker) {
    swEntryWorker = new Worker(self.__SERWIST_SW_ENTRY.swEntryWorker);
  }

  window.serwist = new Serwist(window.location.origin + self.__SERWIST_SW_ENTRY.sw, {
    scope: self.__SERWIST_SW_ENTRY.scope,
  });

  if (self.__SERWIST_SW_ENTRY.register) {
    window.serwist.register();
  }

  if (self.__SERWIST_SW_ENTRY.cacheOnFrontEndNav) {
    const cacheOnFrontEndNav = async (url?: string | URL | null | undefined) => {
      if (!window.navigator.onLine || !url) {
        return;
      }
      swEntryWorker?.postMessage({
        type: "__FRONTEND_NAV_CACHE__",
        url,
      } satisfies MessageType);
    };

    const pushState = history.pushState;
    history.pushState = (...args) => {
      pushState.apply(history, args);
      cacheOnFrontEndNav(args[2]);
    };

    const replaceState = history.replaceState;
    history.replaceState = (...args) => {
      replaceState.apply(history, args);
      cacheOnFrontEndNav(args[2]);
    };

    window.addEventListener("online", () => {
      cacheOnFrontEndNav(window.location.pathname);
    });
  }

  if (self.__SERWIST_SW_ENTRY.reloadOnOnline) {
    window.addEventListener("online", () => location.reload());
  }
}
