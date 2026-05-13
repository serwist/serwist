import type { UserConfig } from "vite";
import type { PluginOptions, PluginOptionsComplete } from "./types.js";

export type Framework = "nuxt" | "react-router" | "astro";

export interface PluginContext {
  /**
   * User's Vite config.
   *
   * Note: This value is set by our main plugin, located at plugins/main.ts.
   */
  viteConfig: UserConfig;
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
  options: PluginOptionsComplete;
  /**
   * Is the plugin running on dev?
   *
   * Note: This value is set by our dev plugin, located at plugins/dev.ts.
   */
  devEnvironment: boolean;
  /**
   * To tailor our APIs to these frameworks.
   */
  framework: Framework | undefined;
}

export const createContext = (userOptions: PluginOptions, framework: Framework | undefined): PluginContext => {
  return {
    viteConfig: null!,
    userOptions,
    options: null!,
    devEnvironment: false,
    framework,
  };
};
