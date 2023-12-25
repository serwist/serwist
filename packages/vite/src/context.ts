import type { ResolvedConfig } from "vite";

import type { PluginOptions, ResolvedPluginOptions } from "./types.js";

export interface SerwistViteContext {
  viteConfig: ResolvedConfig;
  userOptions: PluginOptions;
  options: ResolvedPluginOptions;
  useImportRegister: boolean;
  devEnvironment: boolean;
}

export const createContext = (userOptions: PluginOptions): SerwistViteContext => {
  return {
    userOptions,
    options: undefined!,
    viteConfig: undefined!,
    useImportRegister: false,
    devEnvironment: false,
  };
};
