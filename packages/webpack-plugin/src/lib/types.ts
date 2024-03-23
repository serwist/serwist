import type {
  InjectPartial as BaseInjectPartial,
  InjectResolved as BaseInjectResolved,
  BasePartial,
  BaseResolved,
  OptionalSwDestPartial,
  OptionalSwDestResolved,
} from "@serwist/build";
import type { Require } from "@serwist/utils";

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
   * as webpack's standard `exclude` option.
   * @default
   * ```
   * [/\.map$/, /^manifest.*\.js$/]
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
   * as webpack's standard `include` option.
   */
  include?: (string | RegExp | ((arg0: any) => boolean))[];
}

export type WebpackResolved = Require<WebpackPartial, "exclude">;

export interface InjectPartial {
  /**
   * When `true` (the default), the `swSrc` file will be compiled by webpack.
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
   * Optional webpack plugins that will be used when compiling the `swSrc`
   * input file. Only valid if `compileSrc` is `true`.
   */
  webpackCompilationPlugins?: any[];
}

export type InjectResolved = Require<InjectPartial, "compileSrc">;

export interface InjectManifestOptions extends BasePartial, WebpackPartial, BaseInjectPartial, OptionalSwDestPartial, InjectPartial {}

export interface InjectManifestOptionsComplete extends BaseResolved, WebpackResolved, BaseInjectResolved, OptionalSwDestResolved, InjectResolved {}
