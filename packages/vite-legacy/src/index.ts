import type { Plugin } from "vite";

import { createApi } from "./lib/api.js";
import { createContext } from "./lib/context.js";
import type { DevOptions, ExtendManifestEntriesHook, Hooks, PluginOptions, PluginOptionsComplete, SerwistViteApi } from "./lib/types.js";
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
  const api = createApi(ctx);
  return [mainPlugin(ctx, api), buildPlugin(ctx, api), devPlugin(ctx, api)];
};

// This allows for customization.
export { buildPlugin as build, createApi, createContext, devPlugin as dev, mainPlugin as main, resolveEntry, toFs, validateInjectManifestOptions };
export type { SerwistViteContext } from "./lib/context.js";
export type { PluginOptions, PluginOptionsComplete, Hooks, ExtendManifestEntriesHook, DevOptions, SerwistViteApi };
