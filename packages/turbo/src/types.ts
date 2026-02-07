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
import type { BuildOptions as BaseEsbuildNativeOpts } from "esbuild";
import type { BuildOptions as BaseEsbuildWasmOpts } from "esbuild-wasm";
import type { NextConfig as CompleteNextConfig } from "next";
import type { SUPPORTED_ESBUILD_OPTIONS } from "./lib/constants.js";

export type EsbuildSupportedOptions = (typeof SUPPORTED_ESBUILD_OPTIONS)[number];

export type EsbuildWasmOptions = Prettify<any extends BaseEsbuildWasmOpts ? never : Pick<BaseEsbuildWasmOpts, EsbuildSupportedOptions>>;

export type EsbuildNativeOptions = Prettify<any extends BaseEsbuildNativeOpts ? never : Pick<BaseEsbuildNativeOpts, EsbuildSupportedOptions>>;

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
   * A copy of your Next.js configuration. This option has been deprecated
   * and is no longer necessary, as Serwist can load the Next.js configuration
   * itself. It will be removed in Serwist 10.
   *
   * @deprecated
   */
  nextConfig?: Prettify<NextConfig>;
  /**
   * Whether to use the native `esbuild` package instead of
   * `esbuild-wasm` for bundling the service worker. Defaults
   * to `false` if not on Windows, `true` otherwise.
   */
  useNativeEsbuild?: boolean;
  /**
   * Options to configure the esbuild instance used to bundle
   * the service worker.
   */
  esbuildOptions?: EsbuildNativeOptions | EsbuildWasmOptions;
}

export interface TurboResolved extends Require<TurboPartial, "cwd" | "useNativeEsbuild" | "esbuildOptions"> {}

export type InjectManifestOptions = Prettify<
  Omit<BasePartial & GlobPartial & InjectPartial & OptionalGlobDirectoryPartial & TurboPartial, "disablePrecacheManifest">
>;

export type InjectManifestOptionsComplete = Prettify<
  Omit<
    Require<BaseResolved, "dontCacheBustURLsMatching"> & GlobResolved & InjectResolved & RequiredGlobDirectoryResolved & TurboResolved,
    "disablePrecacheManifest"
  >
> & {
  nextConfig: Required<NextConfig>;
};
