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

export type EsbuildSupportedOptions = (typeof SUPPORTED_ESBUILD_OPTIONS)[number];

export type EsbuildOptions = Pick<BuildOptions, EsbuildSupportedOptions>;

export interface TurboPartial {
  /**
   * The path to your working directory.
   *
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * The Next.js `basePath` config option. If this option
   * is not configured, set to `/`.
   */
  basePath: string;
  esbuildOptions?: EsbuildOptions;
}

export type TurboResolved = Require<TurboPartial, "cwd" | "esbuildOptions">;

export type InjectManifestOptions = Prettify<
  Omit<BasePartial & GlobPartial & InjectPartial & OptionalGlobDirectoryPartial & TurboPartial, "disablePrecacheManifest">
>;

export type InjectManifestOptionsComplete = Prettify<
  Omit<BaseResolved & GlobResolved & InjectResolved & RequiredGlobDirectoryResolved & TurboResolved, "disablePrecacheManifest">
>;
