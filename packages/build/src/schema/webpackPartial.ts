import { z } from "zod";

export const webpackPartial = z
  .object({
    /**
     * One or more chunk names whose corresponding output files should be included
     * in the precache manifest.
     */
    chunks: z.array(z.string()).optional(),
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
    exclude: z
      .array(z.union([z.string(), z.instanceof(RegExp), z.function(z.tuple([z.any()]), z.boolean())]))
      .default([/\.map$/, /^manifest.*\.js$/]),
    /**
     * One or more chunk names whose corresponding output files should be excluded
     * from the precache manifest.
     */
    excludeChunks: z.array(z.string()).optional(),
    /**
     * One or more specifiers used to include assets in the precache manifest.
     * This is interpreted following
     * [the same rules](https://webpack.js.org/configuration/module/#condition)
     * as `webpack`'s standard `include` option.
     */
    include: z.array(z.union([z.string(), z.instanceof(RegExp), z.function(z.tuple([z.any()]), z.boolean())])).optional(),
    /**
     * If set to 'production', then an optimized service worker bundle that
     * excludes debugging info will be produced. If not explicitly configured
     * here, the `mode` value configured in the current `webpack` compilation
     * will be used.
     */
    mode: z.string().nullable().optional(),
  })
  .strict("Do not pass invalid properties to WebpackPartial!");

export const webpackInjectManifestPartial = z
  .object({
    /**
     * When `true` (the default), the `swSrc` file will be compiled by `webpack`.
     * When `false`, compilation will not occur (and `webpackCompilationPlugins`
     * can't be used.) Set to `false` if you want to inject the manifest into,
     * e.g., a JSON file.
     * @default true
     */
    compileSrc: z.boolean().default(true),
    // This doesn't have a hardcoded default value; instead, the default will be
    // set at runtime to the swSrc basename, with the hardcoded extension .js.
    /**
     * The asset path of the service worker file that will be created by this
     * plugin. If omitted, the path will be based on `swSrc` (not applicable for
     * `@serwist/next`, which requires this value to always be defined).
     */
    swDest: z.string().optional(),
    // This can only be set if `compileSrc` is true, but that restriction can't be
    // represented in TypeScript. It's enforced via custom runtime validation
    // logic and needs to be documented.
    /**
     * Optional `webpack` plugins that will be used when compiling the `swSrc`
     * input file. Only valid if `compileSrc` is `true`.
     */
    webpackCompilationPlugins: z.array(z.any()).optional(),
  })
  .strict("Do not pass invalid properties to WebpackInjectManifestPartial!");
