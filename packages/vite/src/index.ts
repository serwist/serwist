import type { Plugin } from "vite";
import type { PluginContext } from "./lib/context.js";
import { createContext } from "./lib/context.js";
import type { PluginOptions, PluginOptionsComplete } from "./lib/types.js";
import { injectPlugin } from "./plugins/inject.js";
import { mainPlugin } from "./plugins/main.js";
import { postprocessPlugin } from "./plugins/postprocess.js";

/**
 * Integrates Serwist into your Vite application.
 *
 * @param options Options for the plugin.
 * @returns
 */
export const serwist = (userOptions: PluginOptions): Plugin[] => {
  const ctx = createContext(userOptions, undefined);
  return [mainPlugin(ctx), injectPlugin(ctx), postprocessPlugin];
};

export type { PluginOptions, PluginOptionsComplete, PluginContext as SerwistViteContext };
