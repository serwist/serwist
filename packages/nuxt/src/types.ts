import type { PluginOptions } from "@serwist/vite";

import type { OptionalFields } from "./utils-types.js";

export interface ClientOptions {
  /**
   * Exposes the plugin: defaults to true.
   */
  registerPlugin?: boolean;
  /**
   * Registers a periodic sync for updates interval: value in seconds.
   */
  periodicSyncForUpdates?: number;
}

export interface ModuleOptions extends OptionalFields<PluginOptions, "swSrc" | "swDest" | "globDirectory"> {
  /**
   * Options for plugin.
   */
  client?: ClientOptions;
}
