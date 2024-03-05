import type { Plugin } from "vite";

import { createApi } from "./api.js";
import { createContext } from "./context.js";
import { buildPlugin } from "./plugins/build.js";
import { devPlugin } from "./plugins/dev.js";
import { mainPlugin } from "./plugins/main.js";
import type { PluginOptions } from "./types.js";
import { resolveEntry, toFs } from "./utils.js";

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
export { buildPlugin as build, createApi, createContext, devPlugin as dev, mainPlugin as main, resolveEntry, toFs };
export type { SerwistViteContext } from "./context.js";
export type * from "./types.js";
