import { createSignal } from "solid-js";

import { registerSW } from "./register.js";
import type { RegisterSWOptions } from "./type.js";

export type { RegisterSWOptions };

export const useRegisterSW = (options: RegisterSWOptions = {}) => {
  const { immediate = true, onNeedRefresh, onOfflineReady, onRegisteredSW, onRegisterError } = options;

  const [needRefresh, setNeedRefresh] = createSignal(false);
  const [offlineReady, setOfflineReady] = createSignal(false);

  const updateServiceWorker = () => {
    if (import.meta.env.PROD) {
      registerSW({
        immediate,
        onOfflineReady() {
          setOfflineReady(true);
          onOfflineReady?.();
        },
        onNeedRefresh() {
          setNeedRefresh(true);
          onNeedRefresh?.();
        },
        onRegisteredSW,
        onRegisterError,
      });
    }
  };

  return {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  };
};
