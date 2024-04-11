import { basePartial, injectPartial as baseInjectPartial, optionalSwDestPartial } from "@serwist/build/schema";
import { z } from "zod";

export const webpackPartial = z
  .object({
    chunks: z.array(z.string()).optional(),
    exclude: z
      .array(z.union([z.string(), z.instanceof(RegExp), z.function(z.tuple([z.any()]), z.boolean())]))
      .default([/\.map$/, /^manifest.*\.js$/]),
    excludeChunks: z.array(z.string()).optional(),
    include: z.array(z.union([z.string(), z.instanceof(RegExp), z.function(z.tuple([z.any()]), z.boolean())])).optional(),
  })
  .strict("Do not pass invalid properties to WebpackPartial!");

export const injectPartial = z
  .object({
    compileSrc: z.boolean().default(true),
    swDest: z.string().optional(),
    webpackCompilationPlugins: z.array(z.any()).optional(),
  })
  .strict("Do not pass invalid properties to WebpackInjectManifestPartial!");

export const injectManifestOptions = basePartial
  .merge(webpackPartial)
  .merge(baseInjectPartial)
  .merge(optionalSwDestPartial)
  .merge(injectPartial)
  .strict("Do not pass invalid properties to WebpackInjectManifestOptions!");
