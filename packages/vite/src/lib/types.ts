import type { InjectManifestOptions, InjectManifestOptionsComplete } from "@serwist/build";
import type { Require } from "@serwist/utils";
import type { RolldownOptions } from "rolldown";
import type { BuildOptions, PluginOption, ResolvedConfig } from "vite";
import type { FRAMEWORKS, VIRTUAL_PREFIX, VIRTUAL_SERWIST } from "./constants.js";

export interface VitePartial {
  /**
   * The module type with which the service worker should be registered. Usually used alongside
   * `rollupFormat`.
   *
   * @default "classic"
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#type
   */
  type?: WorkerType;
  /**
   * The service worker's URL scope. Set to `"/foo/"` so that paths under "/foo/"
   * are under the service worker's control while others are not.
   *
   * @default viteOptions.base
   * @see https://vitejs.dev/config/shared-options.html#base
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#scope
   */
  scope?: string;
  /**
   * The base from which Serwist resolves URLs.
   *
   * @default viteOptions.base
   * @see https://vitejs.dev/config/shared-options.html#base
   */
  base?: string;
  /**
   * Whether Serwist should be disabled.
   *
   * @default false
   */
  disable?: boolean;
  /**
   * Hooks of the build lifecycle.
   */
  integration?: Hooks;
  /**
   * The URL to the service worker.
   *
   * @default "/sw.js"
   */
  swUrl?: string;
  /**
   * Rollup/Vite plugins used to build the service worker.
   */
  plugins?: PluginOption[];
  /**
   * The format used to build the service worker.
   *
   * @default "es"
   */
  rollupFormat?: "es" | "iife";
  /**
   * Custom Rollup options used to build the service worker.
   */
  rolldownOptions?: Omit<RolldownOptions, "input" | "output">;
  /**
   * Development-specific options.
   */
  devOptions?: DevOptions;
}

export interface ViteResolved extends Require<VitePartial, "type" | "scope" | "base" | "disable" | "swUrl"> {}

export interface PluginOptions extends VitePartial, Omit<InjectManifestOptions, "disablePrecacheManifest"> {}

export interface PluginOptionsValidated extends ViteResolved {
  injectManifest: Omit<InjectManifestOptionsComplete, "disablePrecacheManifest">;
}

export interface PluginOptionsComplete extends PluginOptionsValidated {
  injectManifest: InjectManifestOptionsComplete;
}

export interface Hooks {
  /**
   * Allows you to run some logic before the service worker is built.
   * @param options
   * @returns
   */
  beforeBuildServiceWorker?: (options: PluginOptionsComplete) => void | Promise<void>;
  /**
   * Adjusts the application order of `vite-plugin-serwist`'s `closeBundle` hook.
   */
  closeBundleOrder?: "pre" | "post" | null;
  /**
   * Allows you to configure the options of Serwist and Vite. Useful when there is a dependency between the two.
   * @param viteOptions
   * @param options
   * @returns
   */
  configureOptions?: (viteOptions: ResolvedConfig, options: PluginOptions) => void | Promise<void>;
}

export interface DevOptions {
  /**
   * Whether the service worker should be bundled in development mode.
   *
   * @default true
   */
  bundle?: boolean;
  /**
   * Whether the service worker should be minified in development mode.
   *
   * @default false
   */
  minify?: BuildOptions["minify"];
}

export type VirtualPrefix = typeof VIRTUAL_PREFIX;
export type VirtualSerwist = typeof VIRTUAL_SERWIST;
export type Frameworks = (typeof FRAMEWORKS)[number];
export type VirtualFrameworks = `${VirtualPrefix}${VirtualSerwist}/${Frameworks}`;
