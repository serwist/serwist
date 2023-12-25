import { ref } from "vue";

import { registerSW } from "./register.js";
import type { RegisterSWOptions } from "./type.js";

export type { RegisterSWOptions };

export const useRegisterSW = (options: RegisterSWOptions = {}) => {
  const { immediate = true, onNeedRefresh, onOfflineReady, onRegisteredSW, onRegisterError } = options;

  const needRefresh = ref(false);
  const offlineReady = ref(false);

  const updateServiceWorker = () => {
    if (import.meta.env.PROD) {
      registerSW({
        immediate,
        onNeedRefresh() {
          needRefresh.value = true;
          onNeedRefresh?.();
        },
        onOfflineReady() {
          offlineReady.value = true;
          onOfflineReady?.();
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
