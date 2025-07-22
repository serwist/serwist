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
import { assertType, type Equals } from "@serwist/build/schema";
import type { Prettify } from "@serwist/utils";
import type z from "zod";
import type { injectManifestOptions } from "./index.schema.js";

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
}

export type TurboResolved = Required<TurboPartial>;

export type InjectManifestOptions = Prettify<BasePartial & GlobPartial & InjectPartial & OptionalGlobDirectoryPartial & TurboPartial>;

export type InjectManifestOptionsComplete = Prettify<BaseResolved & GlobResolved & InjectResolved & RequiredGlobDirectoryResolved & TurboResolved>;

assertType<Equals<InjectManifestOptions, z.input<typeof injectManifestOptions>>>();
assertType<Equals<InjectManifestOptionsComplete, z.output<typeof injectManifestOptions>>>();
