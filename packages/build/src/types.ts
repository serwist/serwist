import type { QueueOptions } from "@serwist/background-sync";
import type { BroadcastCacheUpdateOptions } from "@serwist/broadcast-update";
import type { CacheableResponseOptions } from "@serwist/cacheable-response";
import type { RouteHandler, RouteMatchCallback, SerwistPlugin } from "@serwist/core";
import type { ExpirationPluginOptions } from "@serwist/expiration";
import type { GoogleAnalyticsInitializeOptions } from "@serwist/google-analytics/initialize";
import type { PrecacheRouteOptions } from "@serwist/precaching";
import type { HTTPMethod } from "@serwist/routing";
import type { PackageJson } from "type-fest";

export interface ManifestEntry {
  integrity?: string;
  revision: string | null;
  url: string;
}

export type StrategyName = "CacheFirst" | "CacheOnly" | "NetworkFirst" | "NetworkOnly" | "StaleWhileRevalidate";

export interface RuntimeCaching {
  /**
   * This determines how the runtime route will generate a response.
   * To use one of the built-in `@serwist/strategies`, provide its name,
   * like `'NetworkFirst'`.
   * Alternatively, this can be a `@serwist/core.RouteHandler` callback
   * function with custom response logic.
   */
  handler: RouteHandler | StrategyName;
  /**
   * The HTTP method to match against. The default value of `'GET'` is normally
   * sufficient, unless you explicitly need to match `'POST'`, `'PUT'`, or
   * another type of request.
   * @default "GET"
   */
  method?: HTTPMethod;
  options?: {
    /**
     * Configuring this will add a
     * `@serwist/background-sync.BackgroundSyncPlugin` instance to the
     * `@serwist/strategies` configured in `handler`.
     */
    backgroundSync?: {
      name: string;
      options?: QueueOptions;
    };
    /**
     * Configuring this will add a
     * `@serwist/broadcast-update.BroadcastUpdatePlugin` instance to the
     * `@serwist/strategies` configured in `handler`.
     */
    broadcastUpdate?: {
      // TODO: This option is ignored since we switched to using postMessage().
      // Remove it in the next major release.
      channelName?: string;
      options: BroadcastCacheUpdateOptions;
    };
    /**
     * Configuring this will add a
     * `@serwist/cacheable-response.CacheableResponsePlugin` instance to
     * the `@serwist/strategies` configured in `handler`.
     */
    cacheableResponse?: CacheableResponseOptions;
    /**
     * If provided, this will set the `cacheName` property of the
     * `@serwist/strategies` configured in `handler`.
     */
    cacheName?: string | null;
    /**
     * Configuring this will add a
     * `@serwist/expiration.ExpirationPlugin` instance to
     * the `@serwist/strategies` configured in `handler`.
     */
    expiration?: ExpirationPluginOptions;
    /**
     * If provided, this will set the `networkTimeoutSeconds` property of the
     * `@serwist/strategies` configured in `handler`. Note that only
     * `'NetworkFirst'` and `'NetworkOnly'` support `networkTimeoutSeconds`.
     */
    networkTimeoutSeconds?: number;
    /**
     * Configuring this allows the use of one or more Serwist plugins that
     * don't have "shortcut" options (like `expiration` for
     * `@serwist/expiration.ExpirationPlugin`). The plugins provided here
     * will be added to the `@serwist/strategies` configured in `handler`.
     */
    plugins?: Array<SerwistPlugin>;
    /**
     * Configuring this will add a
     * `@serwist/precaching.PrecacheFallbackPlugin` instance to
     * the `@serwist/strategies` configured in `handler`.
     */
    precacheFallback?: {
      fallbackURL: string;
    };
    /**
     * Enabling this will add a
     * `@serwist/range-requests.RangeRequestsPlugin` instance to
     * the `@serwist/strategies` configured in `handler`.
     */
    rangeRequests?: boolean;
    /**
     * Configuring this will pass along the `fetchOptions` value to
     * the `@serwist/strategies` configured in `handler`.
     */
    fetchOptions?: RequestInit;
    /**
     * Configuring this will pass along the `matchOptions` value to
     * the `@serwist/strategies` configured in `handler`.
     */
    matchOptions?: CacheQueryOptions;
  };
  /**
   * This match criteria determines whether the configured handler will
   * generate a response for any requests that don't match one of the precached
   * URLs. If multiple `RuntimeCaching` routes are defined, then the first one
   * whose `urlPattern` matches will be the one that responds.
   *
   * This value directly maps to the first parameter passed to
   * `@serwist/routing.registerRoute`. It's recommended to use a
   * `@serwist/core.RouteMatchCallback` function for greatest flexibility.
   */
  urlPattern: RegExp | string | RouteMatchCallback;
}

export interface ManifestTransformResult {
  manifest: Array<ManifestEntry & { size: number }>;
  warnings?: Array<string>;
}

export type ManifestTransform = (
  manifestEntries: Array<ManifestEntry & { size: number }>,
  compilation?: unknown
) => Promise<ManifestTransformResult> | ManifestTransformResult;

export interface BasePartial {
  /**
   * A list of entries to be precached, in addition to any entries that are
   * generated as part of the build configuration.
   */
  additionalPrecacheEntries?: Array<string | ManifestEntry>;
  /**
   * Whether the precache manifest should be set to `undefined`. Essentially whether `@serwist/build` should
   * be disabled. Mostly useful when you want it to only check if the provided options are valid.
   * @default false
   */
  disablePrecacheManifest?: boolean;
  /**
   * Assets that match this will be assumed to be uniquely versioned via their
   * URL, and exempted from the normal HTTP cache-busting that's done when
   * populating the precache. While not required, it's recommended that if your
   * existing build process already inserts a `[hash]` value into each filename,
   * you provide a RegExp that will detect that, as it will reduce the bandwidth
   * consumed when precaching.
   */
  dontCacheBustURLsMatching?: RegExp;
  /**
   * One or more functions which will be applied sequentially against the
   * generated manifest. If `modifyURLPrefix` or `dontCacheBustURLsMatching` are
   * also specified, their corresponding transformations will be applied first.
   */
  manifestTransforms?: Array<ManifestTransform>;
  /**
   * This value can be used to determine the maximum size of files that will be
   * precached. This prevents you from inadvertently precaching very large files
   * that might have accidentally matched one of your patterns.
   * @default 2097152
   */
  maximumFileSizeToCacheInBytes?: number;
  /**
   * An object mapping string prefixes to replacement string values. This can be
   * used to, e.g., remove or add a path prefix from a manifest entry if your
   * web hosting setup doesn't match your local filesystem setup. As an
   * alternative with more flexibility, you can use the `manifestTransforms`
   * option and provide a function that modifies the entries in the manifest
   * using whatever logic you provide.
   *
   * Example usage:
   *
   * ```
   * // Replace a '/dist/' prefix with '/', and also prepend
   * // '/static' to every URL.
   * modifyURLPrefix: {
   *   '/dist/': '/',
   *   '': '/static',
   * }
   * ```
   */
  modifyURLPrefix?: {
    [key: string]: string;
  };
}

// This needs to be set when using GetManifest or InjectManifest. This is
// enforced via runtime validation, and needs to be documented.
export interface RequiredGlobDirectoryPartial {
  /**
   * The local directory you wish to match `globPatterns` against. The path is
   * relative to the current directory.
   */
  globDirectory: string;
}

export interface OptionalGlobDirectoryPartial {
  /**
   * The local directory you wish to match `globPatterns` against. The path is
   * relative to the current directory.
   */
  globDirectory?: string;
}

export interface GlobPartial {
  /**
   * Determines whether or not symlinks are followed when generating the
   * precache manifest. For more information, see the definition of `follow` in
   * the `glob` [documentation](https://github.com/isaacs/node-glob#options).
   * @default true
   */
  globFollow?: boolean;
  /**
   * A set of patterns matching files to always exclude when generating the
   * precache manifest. For more information, see the definition of `ignore` in
   * the `glob` [documentation](https://github.com/isaacs/node-glob#options).
   * @default ["**\/node_modules\/**\/*"]
   */
  globIgnores?: Array<string>;
  /**
   * Files matching any of these patterns will be included in the precache
   * manifest. For more information, see the
   * [`glob` primer](https://github.com/isaacs/node-glob#glob-primer).
   * @default ["**\/*.{js,css,html}"]
   */
  globPatterns?: Array<string>;
  /**
   * If true, an error reading a directory when generating a precache manifest
   * will cause the build to fail. If false, the problematic directory will be
   * skipped. For more information, see the definition of `strict` in the `glob`
   * [documentation](https://github.com/isaacs/node-glob#options).
   * @default true
   */
  globStrict?: boolean;
  /**
   * If a URL is rendered based on some server-side logic, its contents may
   * depend on multiple files or on some other unique string value. The keys in
   * this object are server-rendered URLs. If the values are an array of
   * strings, they will be interpreted as `glob` patterns, and the contents of
   * any files matching the patterns will be used to uniquely version the URL.
   * If used with a single string, it will be interpreted as unique versioning
   * information that you've generated for a given URL.
   */
  templatedURLs?: {
    [key: string]: string | Array<string>;
  };
}

export interface InjectPartial {
  /**
   * The string to find inside of the `swSrc` file. Once found, it will be
   * replaced by the generated precache manifest.
   * @default "self.__SW_MANIFEST"
   */
  injectionPoint?: string;
  /**
   * The path to the service worker file that will be read during
   * the build process, relative to the current working directory.
   */
  swSrc: string;
}

export interface WebpackPartial {
  /**
   * One or more chunk names whose corresponding output files should be included
   * in the precache manifest.
   */
  chunks?: Array<string>;
  // We can't use the @default annotation here to assign the value via AJV, as
  // an Array<RegExp> can't be serialized into JSON.
  // The default value of [/\.map$/, /^manifest.*\.js$/] will be assigned by
  // the validation function, and we need to reflect that in the docs.
  /**
   * One or more specifiers used to exclude assets from the precache manifest.
   * This is interpreted following
   * [the same rules](https://webpack.js.org/configuration/module/#condition)
   * as `webpack`'s standard `exclude` option.
   * If not provided, the default value is `[/\.map$/, /^manifest.*\.js$]`.
   */
  //eslint-disable-next-line @typescript-eslint/ban-types
  exclude?: Array<string | RegExp | ((arg0: any) => boolean)>;
  /**
   * One or more chunk names whose corresponding output files should be excluded
   * from the precache manifest.
   */
  excludeChunks?: Array<string>;
  /**
   * One or more specifiers used to include assets in the precache manifest.
   * This is interpreted following
   * [the same rules](https://webpack.js.org/configuration/module/#condition)
   * as `webpack`'s standard `include` option.
   */
  //eslint-disable-next-line @typescript-eslint/ban-types
  include?: Array<string | RegExp | ((arg0: any) => boolean)>;
  /**
   * If set to 'production', then an optimized service worker bundle that
   * excludes debugging info will be produced. If not explicitly configured
   * here, the `mode` value configured in the current `webpack` compilation
   * will be used.
   */
  mode?: string | null;
}

export interface RequiredSWDestPartial {
  /**
   * The path and filename of the service worker file that will be created by
   * the build process, relative to the current working directory. It must end
   * in '.js'.
   */
  swDest: string;
}

export interface WebpackInjectManifestPartial {
  /**
   * When `true` (the default), the `swSrc` file will be compiled by `webpack`.
   * When `false`, compilation will not occur (and `webpackCompilationPlugins`
   * can't be used.) Set to `false` if you want to inject the manifest into,
   * e.g., a JSON file.
   * @default true
   */
  compileSrc?: boolean;
  // This doesn't have a hardcoded default value; instead, the default will be
  // set at runtime to the swSrc basename, with the hardcoded extension .js.
  /**
   * The asset path of the service worker file that will be created by this
   * plugin. If omitted, the path will be based on `swSrc` (not applicable for
   * `@serwist/next`, which requires this value to always be defined).
   */
  swDest?: string;
  // This can only be set if `compileSrc` is true, but that restriction can't be
  // represented in TypeScript. It's enforced via custom runtime validation
  // logic and needs to be documented.
  /**
   * Optional `webpack` plugins that will be used when compiling the `swSrc`
   * input file. Only valid if `compileSrc` is `true`.
   */
  webpackCompilationPlugins?: Array<any>;
}

export type GetManifestOptions = BasePartial & GlobPartial & RequiredGlobDirectoryPartial;

export type InjectManifestOptions = BasePartial & GlobPartial & InjectPartial & RequiredSWDestPartial & RequiredGlobDirectoryPartial;

export type WebpackInjectManifestOptions = BasePartial & WebpackPartial & InjectPartial & WebpackInjectManifestPartial;

export interface GetManifestResult {
  count: number;
  manifestEntries: Array<ManifestEntry> | undefined;
  size: number;
  warnings: Array<string>;
}

export type BuildResult = Omit<GetManifestResult, "manifestEntries"> & {
  filePaths: Array<string>;
};

/**
 * @private
 */
export interface FileDetails {
  file: string;
  hash: string;
  size: number;
}

/**
 * @private
 */
export type BuildType = "dev" | "prod";

/**
 * @private
 */
export type SerwistPackageJSON = PackageJson;

/**
 * @private
 */
export type MethodNames = "GetManifest" | "InjectManifest" | "WebpackInjectManifest";

/**
 * @private
 */
export interface SerwistSWTemplateOptions {
  shouldSkipWaiting: boolean;
  scriptsToImport?: string[];
  navigationPreload: boolean;
  cacheId: string | undefined;
  shouldClientsClaim: boolean;
  shouldRunPrecacheAndRoute: boolean;
  manifestEntries: ManifestEntry[];
  precacheOptions: PrecacheRouteOptions;
  shouldCleanupOutdatedCaches: boolean;
  navigateFallback: string | undefined;
  navigateFallbackAllowlist: RegExp[];
  navigateFallbackDenylist: RegExp[];
  offlineAnalyticsConfig?: boolean | GoogleAnalyticsInitializeOptions;
  disableDevLogs: boolean;
  runtimeCaching: RuntimeCaching[];
}
