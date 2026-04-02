import type { SerwistViteContext } from "vite-plugin-serwist";
import { createContext as createViteContext } from "vite-plugin-serwist";

export interface SerwistAstroContext extends SerwistViteContext {}

export const createContext = (): SerwistAstroContext => {
  const ctx = createViteContext(null!, "astro");
  return ctx satisfies SerwistAstroContext;
};
