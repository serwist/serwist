import type { Optional, Require } from "@serwist/utils";
import type { PluginOptions } from "vite-plugin-serwist";

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

export type DefaultModuleKeys = "base" | "scope" | "client" | "swSrc" | "swDest" | "swUrl" | "globDirectory" | "injectionPoint";

export type DefaultModuleOptions = Required<Pick<ModuleOptions, DefaultModuleKeys>>;

export type ResolvedModuleOptions = Require<ModuleOptions, DefaultModuleKeys>;
