import { writable } from "svelte/store";

import { registerSW } from "./register.js";
import type { RegisterSWOptions } from "./type.js";

export type { RegisterSWOptions };

export const registerServiceWorker = (options: RegisterSWOptions = {}) => {
  const { immediate = true, onNeedRefresh, onOfflineReady, onRegisteredSW, onRegisterError } = options;

  const needRefresh = writable(false);
  const offlineReady = writable(false);

  const updateServiceWorker = () => {
    if (import.meta.env.PROD) {
      registerSW({
        immediate,
        onOfflineReady() {
          offlineReady.set(true);
          onOfflineReady?.();
        },
        onNeedRefresh() {
          needRefresh.set(true);
          onNeedRefresh?.();
        },
        onRegisteredSW,
        onRegisterError,
      });
    }
  };

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  };
};
