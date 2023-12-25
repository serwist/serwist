import type { Plugin } from "vite";

import { createApi } from "../../api.js";
import { createContext } from "../../context.js";
import { devPlugin } from "../../plugins/dev.js";
import { infoPlugin } from "../../plugins/info.js";
import { mainPlugin } from "../../plugins/main.js";
import { configurateSvelteKitOptions } from "./config.js";
import { serwistSvelte } from "./serwistSvelte.js";
import type { PluginOptions } from "./types.js";

export const serwist = (userOptions: PluginOptions = {}): Plugin[] => {
  if (!userOptions.integration) userOptions.integration = {};
  userOptions.integration.closeBundleOrder = "pre";
  userOptions.integration.configureOptions = (_, options) => configurateSvelteKitOptions(options);
  const ctx = createContext({
    ...userOptions,
    // These are set to empty strings or `undefined` because they are provided by `serwistSvelte`.
    // If something throws an error because of these, recheck the return order of this function.
    swSrc: "",
    swDest: "",
    globDirectory: undefined as unknown as string,
    swUrl: "/service-worker.js",
  });
  const api = createApi(ctx);
  return [mainPlugin(ctx, api), infoPlugin(ctx, api), devPlugin(ctx), serwistSvelte(userOptions.kit ?? {}, ctx, api)];
};

export * from "./types.js";
