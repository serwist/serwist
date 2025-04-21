import type { Config as ReactRouterConfig } from "@react-router/dev/config";
import type { SerwistViteContext } from "vite-plugin-serwist";
import { createContext as createViteContext } from "vite-plugin-serwist";
import type { ReactRouterPluginContext } from "./types.js";

export interface SerwistReactRouterContext extends SerwistViteContext {
  /**
   * User's React Router config.
   */
  reactRouterConfig: ReactRouterConfig;
  /**
   * Whether we're in React Router's development server.
   */
  isReactRouterDevServer: boolean;
  /**
   * React Router's context.
   */
  reactRouterPluginContext: ReactRouterPluginContext;
}

export const createContext = (): SerwistReactRouterContext => {
  const ctx = createViteContext(null!, "react-router");
  return {
    ...ctx,
    reactRouterConfig: null!,
    isReactRouterDevServer: false,
    reactRouterPluginContext: null!,
  };
};
