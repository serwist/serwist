import { Serwist } from "@serwist/window";
import { isCurrentPageOutOfScope } from "@serwist/window/internal";
import { type ReactNode, useEffect, useState } from "react";
import { SerwistContext, useSerwist } from "./lib/context.js";

export interface SerwistProviderProps {
  swUrl: string;
  register?: boolean;
  cacheOnNavigation?: boolean;
  reloadOnOnline?: boolean;
  options?: RegistrationOptions;
  children?: ReactNode;
}

declare global {
  interface Window {
    serwist: Serwist;
  }
}

export function SerwistProvider({
  swUrl,
  register = true,
  cacheOnNavigation = true,
  reloadOnOnline = true,
  options,
  children,
}: SerwistProviderProps) {
  const [serwist] = useState(() => {
    if (typeof window === "undefined") return null;
    if (!(window.serwist && window.serwist instanceof Serwist) && "serviceWorker" in navigator) {
      window.serwist = new Serwist(swUrl, { ...options, type: options?.type || "module", scope: options?.scope || "/" });
    }
    return window.serwist ?? null;
  });
  useEffect(() => {
    const scope = options?.scope || "/";
    if (register && !isCurrentPageOutOfScope(scope)) {
      void serwist?.register();
    }
  }, [register, options?.scope, serwist?.register]);
  useEffect(() => {
    const cacheUrls = async (url?: string | URL | null | undefined) => {
      if (!window.navigator.onLine || !url) {
        return;
      }
      serwist?.messageSW({
        type: "CACHE_URLS",
        payload: { urlsToCache: [url] },
      });
    };
    const cacheCurrentPathname = () => cacheUrls(window.location.pathname);
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    if (cacheOnNavigation) {
      history.pushState = (...args) => {
        pushState.apply(history, args);
        cacheUrls(args[2]);
      };
      history.replaceState = (...args) => {
        replaceState.apply(history, args);
        cacheUrls(args[2]);
      };
      window.addEventListener("online", cacheCurrentPathname);
    }

    return () => {
      history.pushState = pushState;
      history.replaceState = replaceState;
      window.removeEventListener("online", cacheCurrentPathname);
    };
  }, [serwist?.messageSW, cacheOnNavigation]);
  useEffect(() => {
    const reload = () => location.reload();
    if (reloadOnOnline) {
      window.addEventListener("online", reload);
    }
    return () => {
      window.removeEventListener("online", reload);
    };
  }, [reloadOnOnline]);
  return <SerwistContext.Provider value={{ serwist }}>{children}</SerwistContext.Provider>;
}

export { useSerwist };
