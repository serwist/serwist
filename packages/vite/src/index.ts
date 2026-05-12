import type { Plugin } from "vite";
import { createContext, type SerwistViteContext } from "./lib/context.js";
import type { PluginOptions, PluginOptionsComplete } from "./lib/types.js";
import { buildPlugin } from "./plugins/build.js";
import { devPlugin } from "./plugins/dev.js";
import { mainPlugin } from "./plugins/main.js";
import { virtualPlugin } from "./plugins/virtual.js";

/**
 * Integrates Serwist into your Vite application.
 *
 * @param options Options for the plugin.
 * @returns
 */
export const serwist = (options: PluginOptions): Plugin[] => {
  const ctx = createContext(options, undefined);
  return [mainPlugin(ctx), buildPlugin(ctx)];
};

export { buildPlugin, devPlugin, mainPlugin, virtualPlugin };
export type { PluginOptions, PluginOptionsComplete, SerwistViteContext };

