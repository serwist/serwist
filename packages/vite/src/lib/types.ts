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
   * The mode in which Serwist should be built.
   *
   * @default
   * process.env.NODE_ENV // or "production" if undefined
   */
  mode?: "development" | "production";
  /**
   * The service worker type.
   *
   * @default "classic"
   */
  type?: WorkerType;
  /**
   * The scope with which Serwist should register the service worker.
   *
   * @default viteOptions.base
   */
  scope?: string;
  /**
   * The base from which Serwist resolves URLs.
   *
   * @default viteOptions.base
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
   * Plugins used to build your service worker.
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
  beforeBuildServiceWorker?: (options: PluginOptionsComplete) => void | Promise<void>;
  closeBundleOrder?: "pre" | "post" | null;
  configureOptions?: (viteOptions: ResolvedConfig, options: PluginOptions) => void | Promise<void>;
}

export interface DevOptions {
  /**
   * Whether the service worker should be bundled in development mode.
   *
   * Many browsers still [do not support ES Modules in service workers](https://caniuse.com/mdn-api_serviceworker_ecmascript_modules). However, in development
   * mode, certain frameworks, such as SvelteKit, do not bundle the service worker. As a result, trying to register that service worker on browsers lacking
   * support, such as Firefox or Safari, will fail, but doing so on browsers not lacking support will not fail. This option is provided to prevent that from
   * happening. What the plugin does is intercepting any request to the service worker (requests for `swUrl`) and returning a bundled one.
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

export interface ShareTargetFiles {
  name: string;
  accept: string | string[];
}

// biome-ignore lint/complexity/noBannedTypes: We intentionally do this.
type Nothing = {};

/**
 * type StringLiteralUnion<'maskable'> = 'maskable' | string
 * This has auto completion whereas `'maskable' | string` doesn't
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 */
export type StringLiteralUnion<T extends U, U = string> = T | (U & Nothing);

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
