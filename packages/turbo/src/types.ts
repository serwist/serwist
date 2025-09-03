import type {
  BasePartial,
  BaseResolved,
  GlobPartial,
  GlobResolved,
  InjectPartial,
  InjectResolved,
  OptionalGlobDirectoryPartial,
  RequiredGlobDirectoryResolved,
} from "@serwist/build";
import type { Prettify, Require } from "@serwist/utils";
import type { BuildOptions } from "esbuild-wasm";
import type { SUPPORTED_ESBUILD_OPTIONS } from "./lib/constants.js";
import type { NextConfig as CompleteNextConfig } from "next";

export type EsbuildSupportedOptions = (typeof SUPPORTED_ESBUILD_OPTIONS)[number];

export type EsbuildOptions = Pick<BuildOptions, EsbuildSupportedOptions>;

export interface NextConfig extends Pick<CompleteNextConfig, "basePath" | "distDir"> {
  /**
   * The Next.js `assetPrefix` config option.
   *
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/assetPrefix
   */
  assetPrefix?: string;
  /**
   * The Next.js `basePath` config option.
   *
   * @default "/"
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
   */
  basePath?: string;
  /**
   * The Next.js `distDir` config option.
   *
   * @default ".next"
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/distDir
   */
  distDir?: string;
}

export interface TurboPartial {
  /**
   * The path to your working directory.
   *
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * A copy of your Next.js configuration. You must check
   * if any option you've configured is needed by Serwist
   * to ensure expected behavior.
   *
   * The following options are currently needed: `assetPrefix`,
   * `basePath`, `distDir`.
   */
  nextConfig: Prettify<NextConfig>;
  /**
   * Options to configure the esbuild instance used to bundle
   * the service worker.
   */
  esbuildOptions?: EsbuildOptions;
}

export interface TurboResolved extends Require<TurboPartial, "cwd" | "esbuildOptions"> {
  nextConfig: Require<NextConfig, "basePath" | "distDir">;
}

export type InjectManifestOptions = Prettify<
  Omit<BasePartial & GlobPartial & InjectPartial & OptionalGlobDirectoryPartial & TurboPartial, "disablePrecacheManifest">
>;

export type InjectManifestOptionsComplete = Prettify<
  Omit<
    Require<BaseResolved, "dontCacheBustURLsMatching"> & GlobResolved & InjectResolved & RequiredGlobDirectoryResolved & TurboResolved,
    "disablePrecacheManifest"
  >
>;
