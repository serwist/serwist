import { swUrl, swScope, swType } from "virtual:serwist";
import type { Serwist } from "@serwist/window";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

const SerwistContext = createContext<Serwist | null>(null);

export const useSerwist = () => {
  const context = useContext(SerwistContext);
  return context;
};

export const SerwistProvider = ({ children }: { children: ReactNode }) => {
  const [serwist, setSerwist] = useState<Serwist | null>(null);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      (async () => setSerwist(new (await import("@serwist/window")).Serwist(swUrl, { scope: swScope, type: swType })))();
    }
  }, []);
  return <SerwistContext.Provider value={serwist}>{children}</SerwistContext.Provider>;
};
