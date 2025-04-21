import { frameworks as frameworksPlugin } from "vite-plugin-serwist";
import type { PluginOptions } from "./types.js";
import { createContext } from "./lib/context.js";
import { devPlugin } from "./plugins/dev.js";
import { mainPlugin } from "./plugins/main.js";
import { buildPlugin } from "./plugins/build.js";

export const serwist = (userOptions: PluginOptions = {}) => {
  const ctx = createContext();
  return [mainPlugin(ctx, userOptions), frameworksPlugin(ctx), buildPlugin(ctx), devPlugin(ctx)];
};

export type { PluginOptions };
