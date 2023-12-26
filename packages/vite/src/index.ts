import type { Plugin } from "vite";

import { createApi } from "./api.js";
import { createContext } from "./context.js";
import { buildPlugin } from "./plugins/build.js";
import { devPlugin } from "./plugins/dev.js";
import { mainPlugin } from "./plugins/main.js";
import type { PluginOptions } from "./types.js";

/**
 * Integrates Serwist into your Vite app.
 * @param userOptions
 * @returns
 */
export const serwist = (userOptions: PluginOptions): Plugin[] => {
  const ctx = createContext(userOptions);
  const api = createApi(ctx);
  return [mainPlugin(ctx, api), buildPlugin(ctx, api), devPlugin(ctx)];
};

export * from "./types.js";
