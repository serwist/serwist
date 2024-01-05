import type { Plugin } from "vite";

import { createApi } from "../../api.js";
import { createContext } from "../../context.js";
import { devPlugin } from "../../plugins/dev.js";
import { mainPlugin } from "../../plugins/main.js";
import type { PluginOptions as BasePluginOptions } from "../../types.js";
import { buildPlugin } from "./build.js";
import { configurateSvelteKitOptions } from "./config.js";
import type { PluginOptions } from "./types.js";

// TODO: handle SvelteKit build errors.
/**
 * Integrates Serwist into your SvelteKit app.
 * @param userOptions
 * @returns
 */
export const serwist = (userOptions: PluginOptions = {}): Plugin[] => {
  if (!userOptions.integration) userOptions.integration = {};
  userOptions.integration.closeBundleOrder = "pre";
  userOptions.integration.configureOptions = (viteConfig, options) => configurateSvelteKitOptions(viteConfig, userOptions.kit ?? {}, options);
  const ctx = createContext(userOptions as BasePluginOptions);
  ctx.framework = "sveltekit";
  const api = createApi(ctx);
  return [mainPlugin(ctx, api), devPlugin(ctx, api), buildPlugin(ctx, api)];
};

export * from "./types.js";
