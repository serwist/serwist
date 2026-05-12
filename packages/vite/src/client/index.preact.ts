import { swScope, swType, swUrl } from "virtual:serwist";
import { Serwist } from "@serwist/window";
import { useState } from "preact/hooks";

export const useSerwist = () => {
  const [serwist] = useState(() => {
    if (import.meta.env.SSR) return null;
    if (!(window.serwist && window.serwist instanceof Serwist) && "serviceWorker" in navigator) {
      window.serwist = new Serwist(swUrl, { scope: swScope, type: swType });
    }
    return window.serwist ?? null;
  });
  return serwist;
};
