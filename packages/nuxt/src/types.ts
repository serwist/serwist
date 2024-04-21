import type { PluginOptions } from "@serwist/vite";
import type { Optional } from "./utils.js";

export interface ClientOptions {
  /**
   * Whether this plugin should be registered.
   */
  registerPlugin?: boolean;
}

export interface ModuleOptions extends Optional<PluginOptions, "swSrc" | "swDest" | "globDirectory"> {
  /**
   * Options for plugin.
   */
  client?: ClientOptions;
}
