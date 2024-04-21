import type { Require } from "@serwist/utils";
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
   * Determines the maximum size of files that will be precached. This prevents
   * you from inadvertently precaching very large files that might have accidentally
   * matched one of your patterns.
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

export type GetManifestOptions = BasePartial & GlobPartial & RequiredGlobDirectoryPartial;

export type GetManifestOptionsComplete = BaseResolved & GlobResolved & RequiredGlobDirectoryResolved;

export type InjectManifestOptions = BasePartial & GlobPartial & InjectPartial & RequiredSwDestPartial & RequiredGlobDirectoryPartial;

export type InjectManifestOptionsComplete = BaseResolved & GlobResolved & InjectResolved & RequiredSwDestResolved & RequiredGlobDirectoryResolved;

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
  hash: string | null;
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
