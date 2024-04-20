import type {
  BasePartial,
  BaseResolved,
  GlobPartial,
  GlobResolved,
  InjectPartial as BaseInjectPartial,
  InjectResolved as BaseInjectResolved,
  ManifestEntry,
  RequiredGlobDirectoryPartial,
  RequiredGlobDirectoryResolved,
  RequiredSwDestPartial,
  RequiredSwDestResolved,
} from "@serwist/build";
import type { Require } from "@serwist/utils";
import type { RollupOptions } from "rollup";
import type { BuildOptions, Plugin, ResolvedConfig } from "vite";

export interface InjectPartial {
  /**
   * The mode in which your service worker should be built.
   *
   * @default
   * process.env.NODE_ENV // or "production" if undefined
   */
  mode?: "development" | "production";
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
  plugins?: Plugin[];
  /**
   * The format used to build the service worker.
   *
   * @default "es"
   */
  rollupFormat?: "es" | "iife";
  /**
   * Custom Rollup options used to build the service worker.
   */
  rollupOptions?: Omit<RollupOptions, "plugins" | "output">;
  /**
   * Development-specific options.
   */
  devOptions?: DevOptions;
}

export interface InjectResolved extends Require<InjectPartial, "mode" | "type" | "scope" | "base" | "disable" | "swUrl" | "rollupFormat"> {
  devOptions: Required<DevOptions>;
}

export interface InjectManifestOptions
  extends Omit<BasePartial, "disablePrecacheManifest">,
    GlobPartial,
    BaseInjectPartial,
    RequiredSwDestPartial,
    RequiredGlobDirectoryPartial,
    InjectPartial {}

export interface InjectManifestOptionsComplete
  extends BaseResolved,
    GlobResolved,
    BaseInjectResolved,
    RequiredSwDestResolved,
    RequiredGlobDirectoryResolved,
    InjectResolved {}

export interface Hooks {
  /**
   * Allows you to run some logic before the service worker is built.
   * @param options 
   * @returns 
   */
  beforeBuildServiceWorker?: (options: PluginOptionsComplete) => void | Promise<void>;
  /**
   * Adjusts the application order of `@serwist/vite`'s `closeBundle` hook.
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

export interface PluginOptions extends InjectManifestOptions {}

export interface PluginOptionsComplete extends InjectResolved {
  injectManifest: Omit<InjectManifestOptionsComplete, keyof InjectResolved>;
}

export interface SerwistViteApi {
  /**
   * Whether the plugin is disabled.
   */
  disabled: boolean;
  /**
   * Extends the precache manifest.
   * @param fn
   */
  extendManifestEntries(fn: ExtendManifestEntriesHook): void;
  /*
   * Generates the service worker.
   */
  generateSW(): Promise<void>;
}

export type ExtendManifestEntriesHook = (manifestEntries: (string | ManifestEntry)[]) => (string | ManifestEntry)[] | undefined;
