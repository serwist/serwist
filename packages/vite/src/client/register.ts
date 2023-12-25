import type { Serwist } from "@serwist/window";
import { swAutoUpdate, swScope, swType, swUrl } from "virtual:internal-serwist";

import type { RegisterSWOptions } from "./type.js";

export type { RegisterSWOptions };

export const registerSW = (options: RegisterSWOptions = {}) => {
  const { immediate = false, onNeedRefresh, onOfflineReady, onRegisteredSW, onRegisterError } = options;

  let serwist: Serwist | undefined;
  // We assign it to a Promise near the end of the function.
  // eslint-disable-next-line prefer-const
  let registerPromise: Promise<void>;
  let sendSkipWaitingMessage: () => Promise<void> | undefined;

  const updateServiceWorker = async () => {
    await registerPromise;
    if (!swAutoUpdate) {
      await sendSkipWaitingMessage?.();
    }
  };

  const register = async () => {
    if ("serviceWorker" in navigator) {
      const { Serwist } = await import("@serwist/window");
      serwist = new Serwist(swUrl, { scope: swScope, type: swType });
      sendSkipWaitingMessage = async () => {
        // Send a message to the waiting service worker,
        // instructing it to activate.
        // Note: for this to work, you have to add a message
        // listener in your service worker. See below.
        serwist?.messageSkipWaiting();
      };
      if (swAutoUpdate) {
        serwist.addEventListener("activated", (event) => {
          if (event.isUpdate || event.isExternal) window.location.reload();
        });
        serwist.addEventListener("installed", (event) => {
          if (!event.isUpdate) {
            onOfflineReady?.();
          }
        });
      } else {
        let onNeedRefreshCalled = false;
        const showSkipWaitingPrompt = () => {
          onNeedRefreshCalled = true;
          // \`event.wasWaitingBeforeRegister\` will be false if this is
          // the first time the updated service worker is waiting.
          // When \`event.wasWaitingBeforeRegister\` is true, a previously
          // updated service worker is still waiting.
          // You may want to customize the UI prompt accordingly.

          // Assumes your app has some sort of prompt UI element
          // that a user can either accept or reject.
          // Assuming the user accepted the update, set up a listener
          // that will reload the page as soon as the previously waiting
          // service worker has taken control.
          serwist?.addEventListener("controlling", (event) => {
            if (event.isUpdate) window.location.reload();
          });

          onNeedRefresh?.();
        };
        serwist.addEventListener("installed", (event) => {
          if (typeof event.isUpdate === "undefined") {
            if (typeof event.isExternal !== "undefined") {
              if (event.isExternal) showSkipWaitingPrompt();
              else !onNeedRefreshCalled && onOfflineReady?.();
            } else {
              if (event.isExternal) window.location.reload();
              else !onNeedRefreshCalled && onOfflineReady?.();
            }
          } else if (!event.isUpdate) {
            onOfflineReady?.();
          }
        });
        // Add an event listener to detect when the registered
        // service worker has installed but is waiting to activate.
        serwist.addEventListener("waiting", showSkipWaitingPrompt);
        // @ts-expect-error event listener provided by workbox-window
        serwist.addEventListener("externalwaiting", showSkipWaitingPrompt);
      }

      // register the service worker
      serwist
        .register({ immediate })
        .then((r) => {
          onRegisteredSW?.(swUrl, r);
        })
        .catch((e) => {
          onRegisterError?.(e);
        });
    }
  };

  registerPromise = register();

  return updateServiceWorker;
};
