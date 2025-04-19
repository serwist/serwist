import type {
  InjectPartial as BaseInjectPartial,
  InjectResolved as BaseInjectResolved,
  BasePartial,
  BaseResolved,
  GlobPartial,
  GlobResolved,
  OptionalGlobDirectoryPartial,
  OptionalSwDestPartial,
  RequiredGlobDirectoryPartial,
  RequiredGlobDirectoryResolved,
  RequiredSwDestPartial,
  RequiredSwDestResolved,
} from "@serwist/build";
import type { Prettify } from "@serwist/utils";

export interface OptionalSwSrcPartial {
  /**
   * The path to the service worker file that will be read during
   * the build process, relative to the current working directory.
   */
  swSrc?: string;
}

export interface RequiredSwSrcPartial {
  /**
   * The path to the service worker file that will be read during
   * the build process, relative to the current working directory.
   */
  swSrc: string;
}

export type InjectManifestOptions = Prettify<
  Omit<BasePartial, "disablePrecacheManifest"> &
    GlobPartial &
    Omit<BaseInjectPartial, "swSrc"> &
    OptionalSwSrcPartial &
    OptionalSwDestPartial &
    OptionalGlobDirectoryPartial
>;

// Optional `swDest` and `globDirectory` for users but required for us.
export type InjectManifestOptionsResolved = Prettify<
  InjectManifestOptions & RequiredSwSrcPartial & RequiredSwDestPartial & RequiredGlobDirectoryPartial
>;

export type InjectManifestOptionsComplete = Prettify<
  BaseResolved & GlobResolved & BaseInjectResolved & RequiredSwDestResolved & RequiredGlobDirectoryResolved
>;
