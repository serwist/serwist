import type { ResolvedConfig } from "vite";

import type { PluginOptions, ResolvedPluginOptions } from "./types.js";

export interface SerwistViteContext {
  /**
   * Resolved Vite config.
   *
   * Note: This value is set by our main plugin, located at plugins/main.ts.
   */
  viteConfig: ResolvedConfig;
  /**
   * Provided options.
   */
  userOptions: PluginOptions;
  /**
   * Resolved options.
   *
   * Note: this is different from `userOptions` in that it has been parsed, whereas
   * `userOptions` is the raw configuration that the user provides us.
   */
  options: ResolvedPluginOptions;
  useImportRegister: boolean;
  /**
   * Is the plugin running on dev?
   *
   * Note: This value is set by our dev plugin, located at plugins/dev.ts.
   */
  devEnvironment: boolean;
  /** To tailor our APIs to these frameworks. */
  framework: "nuxt" | "sveltekit" | undefined;
}

export const createContext = (userOptions: PluginOptions): SerwistViteContext => {
  return {
    userOptions,
    options: undefined!,
    viteConfig: undefined!,
    useImportRegister: false,
    devEnvironment: false,
    framework: undefined,
  };
};
