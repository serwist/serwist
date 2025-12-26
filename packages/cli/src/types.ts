import type { InjectManifestOptions, InjectManifestOptionsComplete } from "@serwist/build";
import type { Prettify, Require } from "@serwist/utils";
import type { BuildOptions as BaseEsbuildOptions } from "esbuild";
import type { Flag } from "meow";
import type { SUPPORTED_ESBUILD_OPTIONS } from "./lib/constants.js";

export type StringFlag = Flag<"string", string> | Flag<"string", string[], true>;
export type BooleanFlag = Flag<"boolean", boolean> | Flag<"boolean", boolean[], true>;
export type NumberFlag = Flag<"number", number> | Flag<"number", number[], true>;
export type AnyFlag = StringFlag | BooleanFlag | NumberFlag;
export type AnyFlags = Record<string, AnyFlag>;

export type EsbuildSupportedOptions = (typeof SUPPORTED_ESBUILD_OPTIONS)[number];

export type EsbuildOptions = Pick<BaseEsbuildOptions, EsbuildSupportedOptions>;

export interface BuildPartial {
  /**
   * Options to configure the esbuild instance used to bundle
   * the service worker.
   */
  esbuildOptions?: EsbuildOptions;
}

export type BuildResolved = Require<BuildPartial, "esbuildOptions">;

export type BuildOptions = Prettify<InjectManifestOptions & BuildPartial>;

export type BuildOptionsComplete = Prettify<InjectManifestOptionsComplete & BuildResolved>;
