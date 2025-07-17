import type { Serwist } from "@serwist/window";
import { createContext, useContext } from "react";

export interface SerwistContextValues {
  serwist: Serwist | null;
}

export const SerwistContext = createContext<SerwistContextValues>(null!);

export const useSerwist = () => {
  const context = useContext(SerwistContext);
  if (!context) {
    throw new Error("[useSerwist]: 'SerwistContext' is not available.");
  }
  return context;
};
