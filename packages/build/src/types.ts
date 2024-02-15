import type { Require } from "@serwist/utils";
import type { Pattern as GlobPattern } from "fast-glob";
import type { PackageJson } from "type-fest";
import type { z } from "zod";
import type { manifestEntry } from "./schema/manifestEntry.js";
import type { manifestTransform, manifestTransformResult } from "./schema/manifestTransform.js";

export type ManifestEntry = z.input<typeof manifestEntry>;

export type ManifestTransformResult = z.input<typeof manifestTransformResult>;

export type ManifestTransform = z.input<typeof manifestTransform>;

export interface BasePartial {
  /**
   * A list of entries to be precached, in addition to any entries that are
   * generated as part of the build configuration.
   */
  additionalPrecacheEntries?: (string | ManifestEntry)[];
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
  manifestTransforms?: ManifestTransform[];
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

export type BaseResolved = Require<BasePartial, "disablePrecacheManifest" | "maximumFileSizeToCacheInBytes">;

// This needs to be set when using GetManifest or InjectManifest. This is
// enforced via runtime validation, and needs to be documented.
export interface RequiredGlobDirectoryPartial {
  /**
   * The local directory you wish to match `globPatterns` against. The path is
   * relative to the current directory.
   */
  globDirectory: string;
}

export type RequiredGlobDirectoryResolved = RequiredGlobDirectoryPartial;

export interface OptionalGlobDirectoryPartial {
  /**
   * The local directory you wish to match `globPatterns` against. The path is
   * relative to the current directory.
   */
  globDirectory?: string;
}

export type OptionalGlobDirectoryResolved = OptionalGlobDirectoryPartial;

export interface GlobPartial {
  /**
   * Determines whether or not symlinks are followed when generating the
   * precache manifest. For more information, see the definition of `follow` in
   * [`node-glob`'s documentation](https://github.com/isaacs/node-glob#options).
   * @default true
   */
  globFollow?: boolean;
  /**
   * A set of patterns matching files to always exclude when generating the
   * precache manifest. For more information, see the definition of `ignore` in
   * [`node-glob`'s documentation](https://github.com/isaacs/node-glob#options).
   * @default
   * ```
   * ["**\/node_modules\/**\/*"]
   * ```
   */
  globIgnores?: string[];
  /**
   * Files matching any of these patterns will be included in the precache
   * manifest. For more information, see
   * [`node-glob`'s Glob Primer](https://github.com/isaacs/node-glob#glob-primer).
   * @default
   * ```
   * ["**\/*.{js,css,html}"]
   * ```
   */
  globPatterns?: string[];
  /**
   * If true, an error reading a directory when generating a precache manifest
   * will cause the build to fail. If false, the problematic directory will be
   * skipped. For more information, see the definition of `strict` in
   * [`node-glob`'s documentation](https://github.com/isaacs/node-glob#options).
   * @default true
   */
  globStrict?: boolean;
  /**
   * If a URL is rendered based on some server-side logic, its contents may
   * depend on multiple files or on some other unique string value. The keys in
   * this object are server-rendered URLs. If the values are an array of
   * strings, they will be interpreted as glob patterns, and the contents of
   * any files matching the patterns will be used to uniquely version the URL.
   * If used with a single string, it will be interpreted as unique versioning
   * information that you've generated for a given URL.
   */
  templatedURLs?: {
    [key: string]: string | string[];
  };
}

export type GlobResolved = Require<GlobPartial, "globFollow" | "globIgnores" | "globPatterns" | "globStrict">;

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

export type InjectResolved = Require<InjectPartial, "injectionPoint">;

export interface WebpackPartial {
  /**
   * One or more chunk names whose corresponding output files should be included
   * in the precache manifest.
   */
  chunks?: string[];
  // We can't use the @default annotation here to assign the value via AJV, as
  // an (RegExp)[] can't be serialized into JSON.
  // The default value of [/\.map$/, /^manifest.*\.js$/] will be assigned by
  // the validation function, and we need to reflect that in the docs.
  /**
   * One or more specifiers used to exclude assets from the precache manifest.
   * This is interpreted following
   * [the same rules](https://webpack.js.org/configuration/module/#condition)
   * as `webpack`'s standard `exclude` option.
   * @default
   * ```
   * [/\.map$/, /^manifest.*\.js$]
   * ```
   */
  exclude?: (string | RegExp | ((arg0: any) => boolean))[];
  /**
   * One or more chunk names whose corresponding output files should be excluded
   * from the precache manifest.
   */
  excludeChunks?: string[];
  /**
   * One or more specifiers used to include assets in the precache manifest.
   * This is interpreted following
   * [the same rules](https://webpack.js.org/configuration/module/#condition)
   * as `webpack`'s standard `include` option.
   */
  include?: (string | RegExp | ((arg0: any) => boolean))[];
}

export type WebpackResolved = Require<WebpackPartial, "exclude">;

export interface RequiredSwDestPartial {
  /**
   * The path and filename of the service worker file that will be created by
   * the build process. It must end in '.js'.
   */
  swDest: string;
}

export type RequiredSwDestResolved = RequiredSwDestPartial;

export interface OptionalSwDestPartial {
  /**
   * The path and filename of the service worker file that will be created by
   * the build process. It must end in '.js'. If omitted, the path will be
   * based on `swSrc`.
   */
  swDest?: string;
}

export type OptionalSwDestResolved = OptionalSwDestPartial;

export interface WebpackInjectManifestPartial {
  /**
   * When `true` (the default), the `swSrc` file will be compiled by `webpack`.
   * When `false`, compilation will not occur (and `webpackCompilationPlugins`
   * can't be used.) Set to `false` if you want to inject the manifest into,
   * e.g., a JSON file.
   * @default true
   */
  compileSrc?: boolean;
  // This can only be set if `compileSrc` is true, but that restriction can't be
  // represented in TypeScript. It's enforced via custom runtime validation
  // logic and needs to be documented.
  /**
   * Optional `webpack` plugins that will be used when compiling the `swSrc`
   * input file. Only valid if `compileSrc` is `true`.
   */
  webpackCompilationPlugins?: any[];
}

export type WebpackInjectManifestResolved = Require<WebpackInjectManifestPartial, "compileSrc">;

export interface NextInjectManifestPartial {
  /**
   * Enables additional route caching when users navigate through pages with
   * `next/link`. This improves the user experience in some cases but it
   * also adds a bit of overhead due to additional network calls.
   * @default false
   */
  cacheOnNavigation?: boolean;
  /**
   * Whether Serwist should be disabled.
   * @default false
   */
  disable?: boolean;
  /**
   * Whether `@serwist/next` should automatically register the service worker for you. If
   * you want to register the service worker yourself, set this to `false` and run
   * `window.serwist.register()` in `componentDidMount` or `useEffect`.
   * @example
   *   ```tsx
   *   // app/register-pwa.tsx
   *   "use client";
   *   import { useEffect } from "react";
   *   import type { Serwist } from "@serwist/window";
   *
   *   declare global {
   *     interface Window {
   *       serwist: Serwist;
   *     }
   *   }
   *
   *   export default function RegisterPWA() {
   *     useEffect(() => {
   *       if ("serviceWorker" in navigator && window.serwist !== undefined) {
   *         window.serwist.register();
   *       }
   *     }, []);
   *     return <></>;
   *   }
   *
   *   // app/layout.tsx
   *   import RegisterPWA from "./register-pwa";
   *
   *   export default function RootLayout({
   *     children,
   *   }: {
   *     children: React.ReactNode;
   *   }) {
   *     return (
   *       <html lang="en">
   *         <head />
   *         <body>
   *           <RegisterPWA />
   *           {children}
   *         </body>
   *       </html>
   *     );
   *   }
   *   ```
   * @default true
   */
  register?: boolean;
  /**
   * Whether Serwist should reload the app when it goes online.
   * @default true
   */
  reloadOnOnline?: boolean;
  /**
   * The service worker's URL scope. Set to `/foo/` so that paths under `/foo/` are under the service
   * worker's control while others are not.
   * @default nextConfig.basePath
   */
  scope?: string;
  /**
   * The URL to the service worker.
   * @default "/sw.js"
   */
  swUrl?: string;
  /**
   * Files in the public directory matching any of these patterns
   * will be included in the precache manifest. For more information,
   * see [`node-glob`'s Glob Primer](https://github.com/isaacs/node-glob#glob-primer).
   * @default
   * ```
   * ["**\/*"]
   * ```
   */
  globPublicPatterns?: GlobPattern | GlobPattern[];
}

export type NextInjectManifestResolved = Require<
  NextInjectManifestPartial,
  "cacheOnNavigation" | "disable" | "register" | "reloadOnOnline" | "swUrl" | "globPublicPatterns"
>;

export type GetManifestOptions = BasePartial & GlobPartial & RequiredGlobDirectoryPartial;

export type GetManifestOptionsComplete = BaseResolved & GlobResolved & RequiredGlobDirectoryResolved;

export type InjectManifestOptions = BasePartial & GlobPartial & InjectPartial & RequiredSwDestPartial & RequiredGlobDirectoryPartial;

export type InjectManifestOptionsComplete = BaseResolved & GlobResolved & InjectResolved & RequiredSwDestResolved & RequiredGlobDirectoryResolved;

export type WebpackInjectManifestOptions = BasePartial & WebpackPartial & InjectPartial & OptionalSwDestPartial & WebpackInjectManifestPartial;

export type WebpackInjectManifestOptionsComplete = BaseResolved &
  WebpackResolved &
  InjectResolved &
  OptionalSwDestResolved &
  WebpackInjectManifestResolved;

export type ViteInjectManifestOptions = BasePartial & GlobPartial & InjectPartial & RequiredSwDestPartial & RequiredGlobDirectoryPartial;

export type ViteInjectManifestOptionsComplete = BaseResolved & GlobResolved & InjectResolved & RequiredSwDestResolved & RequiredGlobDirectoryResolved;

export type NextInjectManifestOptions = Omit<
  WebpackInjectManifestOptions & RequiredSwDestPartial & NextInjectManifestPartial,
  "disablePrecacheManifest"
>;

export type NextInjectManifestOptionsComplete = Omit<
  WebpackInjectManifestOptionsComplete & RequiredSwDestResolved & NextInjectManifestResolved,
  "disablePrecacheManifest"
>;

export interface GetManifestResult {
  count: number;
  manifestEntries: ManifestEntry[] | undefined;
  size: number;
  warnings: string[];
}

export type BuildResult = Omit<GetManifestResult, "manifestEntries"> & {
  filePaths: string[];
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
export type MethodNames = "GetManifest" | "InjectManifest" | "WebpackInjectManifest" | "ViteInjectManifest";
