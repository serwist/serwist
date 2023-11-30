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
    serwistNextOptions: SerwistNextOptions;
  };

if (typeof window !== "undefined" && "serviceWorker" in navigator && typeof caches !== "undefined") {
  let swEntryWorker: Worker | undefined;

  if (self.serwistNextOptions.swEntryWorker) {
    swEntryWorker = new Worker(self.serwistNextOptions.swEntryWorker);
  }

  window.serwist = new Serwist(window.location.origin + self.serwistNextOptions.sw, {
    scope: self.serwistNextOptions.scope,
  });

  if (self.serwistNextOptions.register) {
    window.serwist.register();
  }

  if (self.serwistNextOptions.cacheOnFrontEndNav) {
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

  if (self.serwistNextOptions.reloadOnOnline) {
    window.addEventListener("online", () => location.reload());
  }
}
