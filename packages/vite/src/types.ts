import type { InjectManifestOptions, ManifestEntry } from "@serwist/build";
import type { RollupOptions } from "rollup";
import type { Plugin, ResolvedConfig } from "vite";

export type InjectManifestVitePlugins = string[] | ((vitePluginIds: string[]) => string[]);
export interface CustomInjectManifestOptions extends Omit<InjectManifestOptions, "disablePrecacheManifest"> {
  /**
   * The URL to the service worker.
   * @default "/sw.js"
   */
  swUrl?: string;
  /**
   * Configure the format to use in the Rollup build.
   *
   * @default 'es'
   */
  rollupFormat?: "es" | "iife";
  /**
   * Since `v0.15.0` you can add plugins to build your service worker.
   *
   * When using `injectManifest` there are 2 builds, your application and the service worker.
   * If you're using custom configuration for your service worker (for example custom plugins) you can use this option to configure the service worker build.
   * Both configurations cannot be shared, and so you'll need to duplicate the configuration, with the exception of `define`.
   *
   * **WARN**: this option is for advanced usage, be aware that you may break your application build.
   */
  plugins?: Plugin[];
  /**
   * Since `v0.15.0` you can add custom Rollup options to build your service worker: we expose the same configuration to build a worker using Vite.
   */
  rollupOptions?: Omit<RollupOptions, "plugins" | "output">;
}

export interface SerwistViteHooks {
  beforeBuildServiceWorker?: (options: ResolvedPluginOptions) => void | Promise<void>;
  closeBundleOrder?: "pre" | "post" | null;
  configureOptions?: (viteOptions: ResolvedConfig, options: PluginOptions) => void | Promise<void>;
}

/**
 * Plugin options.
 */
export interface BasePluginOptions {
  /**
   * Build mode
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
   * The scope to register the Service Worker
   *
   * @default `viteOptions.base`
   */
  scope?: string;
  /**
   * Inject the service worker register inlined in the index.html
   *
   * If set to "auto", depends on whether you used the `import { registerSW } from 'virtual:pwa-register'`
   * it will do nothing or use the `script` mode
   *
   * `"inline"` - inject a simple register, inlined with the generated html
   *
   * `"script"` - inject `<script/>` in `<head>` with `src` attribute to a generated script to register the service worker
   *
   * `"script-defer"` - inject `<script defer />` in `<head>`, with `src` attribute to a generated script to register the service worker
   *
   * `null` - do nothing. You will need to register the service worker yourself or import `registerSW` from `virtual:pwa-register`.
   *
   * @default "auto"
   */
  injectRegister: "inline" | "script" | "script-defer" | "auto" | null | false;
  /**
   * Mode for the virtual register.
   * This is NOT available if `injectRegister` is set to `"inline"` or `"script"`
   *
   * `"prompt"` - you will need to show a popup/dialog to the user to confirm the reload.
   *
   * `"autoUpdate"` - when new content is available, the new service worker will update caches and reload all browser
   * windows/tabs with the application open automatically, it must take the control for the application to work
   * properly.
   *
   * @default "prompt"
   */
  registerType?: "prompt" | "autoUpdate";
  /**
   * Minify the generated manifest
   *
   * @default true
   */
  minify: boolean;
  /**
   * Whether to add the `crossorigin="use-credentials"` attribute to `<link rel="manifest">`
   * @default false
   */
  useCredentials?: boolean;
  /**
   * Override Vite's base options for `@serwist/vite`.
   *
   * @default viteOptions.base
   */
  base?: string;
  /**
   * `public` resources to be added to the PWA manifest.
   *
   * You don't need to add `manifest` icons here, it will be auto included.
   *
   * The `public` directory will be resolved from Vite's `publicDir` option directory.
   */
  includeAssets: string | string[] | undefined;
  /**
   * Whether Serwist should be disabled.
   *
   * @default false
   */
  disable: boolean;
  /**
   * `@serwist/vite` integration.
   */
  integration?: SerwistViteHooks;
  /**
   * When Vite's build folder is not the same as your base root folder, configure it here.
   *
   * This option will be useful for integrations like `vite-plugin-laravel` where Vite's build folder is `public/build` but Laravel's base path is `public`.
   *
   * This option will be used to configure the path for the service worker, "registerSW.js" and the web manifest assets.
   *
   * For example, if your base path is `/`, then, in your Laravel PWA configuration use `buildPath: '/build/'`.
   *
   * By default: `vite.base`.
   */
  buildBase?: string;
}

export type PluginOptions = Partial<BasePluginOptions> & CustomInjectManifestOptions;

export interface InjectManifestRollupOptions {
  format: "es" | "iife";
  plugins: Plugin[];
  rollupOptions: RollupOptions;
}

export interface ResolvedPluginOptions extends Required<BasePluginOptions>, Required<Pick<CustomInjectManifestOptions, "swUrl">> {
  injectManifest: InjectManifestOptions;
  injectManifestRollupOptions: InjectManifestRollupOptions;
}

export interface ShareTargetFiles {
  name: string;
  accept: string | string[];
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/Manifest/launch_handler#launch_handler_item_values
 */
export type LaunchHandlerClientMode = "auto" | "focus-existing" | "navigate-existing" | "navigate-new";

export type Display = "fullscreen" | "standalone" | "minimal-ui" | "browser";
export type DisplayOverride = Display | "window-controls-overlay";
export type IconPurpose = "monochrome" | "maskable" | "any";

interface Nothing {}

/**
 * type StringLiteralUnion<'maskable'> = 'maskable' | string
 * This has auto completion whereas `'maskable' | string` doesn't
 * Adapted from https://github.com/microsoft/TypeScript/issues/29729
 */
export type StringLiteralUnion<T extends U, U = string> = T | (U & Nothing);

export interface SerwistViteApi {
  /**
   * Is the plugin disabled?
   */
  disabled: boolean;
  extendManifestEntries(fn: ExtendManifestEntriesHook): void;
  /*
   * Generate the service worker.
   */
  generateSW(): Promise<void>;
}

export type ExtendManifestEntriesHook = (manifestEntries: (string | ManifestEntry)[]) => (string | ManifestEntry)[] | undefined;
