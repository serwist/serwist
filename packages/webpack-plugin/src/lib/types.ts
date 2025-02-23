import type {
  BasePartial,
  BaseResolved,
  InjectPartial as BaseInjectPartial,
  InjectResolved as BaseInjectResolved,
  OptionalSwDestPartial,
  OptionalSwDestResolved,
} from "@serwist/build";
import type { Require } from "@serwist/utils";
import type { WebpackPluginFunction, WebpackPluginInstance, Asset, Compilation } from "webpack";

export interface ConditionCallbackOptions {
  asset: Asset;
  compilation: Compilation;
};

export type ConditionCallback = (options: ConditionCallbackOptions) => boolean;

export interface WebpackPartial {
  /**
   * One or more chunk names whose corresponding output files should be included
   * in the precache manifest.
   */
  chunks?: string[];
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
  exclude?: (string | RegExp | ConditionCallback)[];
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
  include?: (string | RegExp | ConditionCallback)[];
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
   * file. Only valid if `compileSrc` is `true`.
   */
  webpackCompilationPlugins?: WebpackPlugin[];
}

export type InjectResolved = Require<InjectPartial, "compileSrc">;

export interface InjectManifestOptions extends BasePartial, WebpackPartial, BaseInjectPartial, OptionalSwDestPartial, InjectPartial {}

export interface InjectManifestOptionsComplete extends BaseResolved, WebpackResolved, BaseInjectResolved, OptionalSwDestResolved, InjectResolved {}

export type WebpackPlugin = WebpackPluginFunction | WebpackPluginInstance;
