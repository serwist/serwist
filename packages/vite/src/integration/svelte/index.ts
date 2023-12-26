import type { Plugin } from "vite";

import { createApi } from "../../api.js";
import { createContext } from "../../context.js";
import { devPlugin } from "../../plugins/dev.js";
import { mainPlugin } from "../../plugins/main.js";
import type { PluginOptions as BasePluginOptions } from "../../types.js";
import { configurateSvelteKitOptions } from "./config.js";
import { serwistSvelte } from "./serwistSvelte.js";
import type { PluginOptions } from "./types.js";

export const serwist = (userOptions: PluginOptions = {}): Plugin[] => {
  if (!userOptions.integration) userOptions.integration = {};
  userOptions.integration.closeBundleOrder = "pre";
  userOptions.integration.configureOptions = (viteConfig, options) => configurateSvelteKitOptions(viteConfig, userOptions.kit ?? {}, options);
  const ctx = createContext(userOptions as BasePluginOptions);
  const api = createApi(ctx);
  return [mainPlugin(ctx, api), devPlugin(ctx), serwistSvelte(ctx, api)];
};

export * from "./types.js";
