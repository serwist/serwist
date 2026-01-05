/// <reference types="svelte" />
import { Serwist } from "@serwist/window";
import { BROWSER } from "esm-env";

declare global {
  interface Window {
    serwist: Serwist | undefined;
  }
}

export const useSerwist = (swUrl: string, registerOptions?: RegistrationOptions) => {
  const serwist = $derived.by(() => {
    if (!BROWSER) return null;
    if (!(window.serwist && window.serwist instanceof Serwist) && "serviceWorker" in navigator) {
      window.serwist = new Serwist(swUrl, registerOptions);
    }
    return window.serwist ?? null;
  });
  return {
    get serwist() {
      return serwist;
    },
  };
};
