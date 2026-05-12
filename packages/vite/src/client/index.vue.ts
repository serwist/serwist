import { swScope, swType, swUrl } from "virtual:serwist";
import { Serwist } from "@serwist/window";
import { computed } from "vue";

export const useSerwist = () => {
  const serwist = computed(() => {
    if (import.meta.env.SSR) return null;
    if (!(window.serwist && window.serwist instanceof Serwist) && "serviceWorker" in navigator) {
      window.serwist = new Serwist(swUrl, { scope: swScope, type: swType });
    }
    return window.serwist ?? null;
  });
  return serwist;
};
