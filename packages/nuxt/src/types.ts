import type { PluginOptions } from "@serwist/vite";

import type { OptionalFields } from "./utils-types.js";

export interface ClientOptions {
  /**
   * Whether this plugin should be registered.
   */
  registerPlugin?: boolean;
}

export interface ModuleOptions extends OptionalFields<PluginOptions, "swSrc" | "swDest" | "globDirectory"> {
  manifest?: string;
  /**
   * Options for plugin.
   */
  client?: ClientOptions;
}
