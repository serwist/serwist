import type { Plugin } from "vite";

import { createApi } from "./lib/api.js";
import { createContext } from "./lib/context.js";
import { generateServiceWorker } from "./lib/modules.js";
import type { DevOptions, Hooks, PluginOptions, PluginOptionsComplete, SerwistViteApi } from "./lib/types.js";
import { resolveEntry, toFs } from "./lib/utils.js";
import { validateInjectManifestOptions } from "./lib/validator.js";
import { buildPlugin } from "./plugins/build.js";
import { devPlugin } from "./plugins/dev.js";
import { mainPlugin } from "./plugins/main.js";

/**
 * Integrates Serwist into your Vite app.
 * @param userOptions
 * @returns
 */
export const serwist = (userOptions: PluginOptions): Plugin[] => {
  const ctx = createContext(userOptions, undefined);
  return [mainPlugin(ctx), buildPlugin(ctx), devPlugin(ctx)];
};

// This allows for customization.
export {
  buildPlugin as build,
  devPlugin as dev,
  mainPlugin as main,
  generateServiceWorker,
  createApi,
  createContext,
  resolveEntry,
  toFs,
  validateInjectManifestOptions,
};
export type { SerwistViteContext } from "./lib/context.js";
export type { PluginOptions, PluginOptionsComplete, Hooks, DevOptions, SerwistViteApi };
