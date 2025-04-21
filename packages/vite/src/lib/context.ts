import type { ResolvedConfig, UserConfig } from "vite";

import type { PluginOptions, PluginOptionsComplete } from "./types.js";
import type { Logger } from "@serwist/utils/node";

export type SerwistViteFrameworks = "nuxt" | "react-router" | "astro";

export interface SerwistViteContext {
  /**
   * Resolved Vite config.
   *
   * Note: This value is set by our main plugin, located at plugins/main.ts.
   */
  viteConfig: ResolvedConfig;
  /**
   * User's Vite config.
   *
   * Note: This value is set by our main plugin, located at plugins/main.ts.
   */
  userViteConfig: UserConfig;
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
  framework: SerwistViteFrameworks | undefined;
  /**
   * `@serwist/vite`'s logger.
   */
  logger: Logger;
}

export const createContext = (userOptions: PluginOptions, framework: SerwistViteFrameworks | undefined): SerwistViteContext => {
  return {
    viteConfig: null!,
    userViteConfig: null!,
    userOptions,
    options: null!,
    devEnvironment: false,
    framework,
    logger: null!,
  };
};
