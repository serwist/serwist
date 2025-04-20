import type { Config as ReactRouterConfig } from "@react-router/dev/config";
import type { UserConfig as UserViteConfig } from "vite";
import type { SerwistViteContext } from "vite-plugin-serwist";
import type { ReactRouterPluginContext } from "./types.js";
import type { PluginOptions } from "../index.js";

export interface SerwistReactRouterContext {
  /**
   * User's React Router config.
   */
  reactRouterConfig: ReactRouterConfig;
  /**
   * User options.
   */
  userOptions: PluginOptions;
  /**
   * User's Vite config.
   */
  userViteConfig: UserViteConfig;
  /**
   * Whether we're in React Router's development server.
   */
  isReactRouterDevServer: boolean;
  /**
   * React Router's context.
   */
  reactRouterPluginContext: ReactRouterPluginContext;
  /**
   * `@serwist/vite` context.
   */
  viteContext: SerwistViteContext;
}

export const createContext = (): SerwistReactRouterContext => {
  return {
    reactRouterConfig: null!,
    userOptions: null!,
    userViteConfig: null!,
    isReactRouterDevServer: false,
    reactRouterPluginContext: null!,
    viteContext: null!,
  };
};
