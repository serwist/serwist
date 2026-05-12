/// <reference types="svelte" />
import { swScope, swType, swUrl } from "virtual:serwist";
import { Serwist } from "@serwist/window";

export const useSerwist = () => {
  const serwist = $derived.by(() => {
    if (import.meta.env.SSR) return null;
    if (!(window.serwist && window.serwist instanceof Serwist) && "serviceWorker" in navigator) {
      window.serwist = new Serwist(swUrl, { scope: swScope, type: swType });
    }
    return window.serwist ?? null;
  });
  return {
    get serwist() {
      return serwist;
    },
  };
};
