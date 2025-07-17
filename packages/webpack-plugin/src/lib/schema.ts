import { fn, injectPartial as baseInjectPartial, basePartial, optionalSwDestPartial } from "@serwist/build/schema";
import { z } from "zod";

const webpackConditionCallback = fn({
  input: [z.any()],
  output: z.boolean(),
});

const webpackCondition = z.union([z.string(), z.instanceof(RegExp), webpackConditionCallback]);

export const webpackPartial = z.strictObject({
  chunks: z.array(z.string()).optional(),
  exclude: z.array(webpackCondition).default([/\.map$/, /^manifest.*\.js$/]),
  excludeChunks: z.array(z.string()).optional(),
  include: z.array(webpackCondition).optional(),
});

export const injectPartial = z.strictObject({
  compileSrc: z.boolean().default(true),
  swDest: z.string().optional(),
  webpackCompilationPlugins: z.array(z.any()).optional(),
});

export const injectManifestOptions = z.strictObject({
  ...basePartial.shape,
  ...webpackPartial.shape,
  ...baseInjectPartial.shape,
  ...optionalSwDestPartial.shape,
  ...injectPartial.shape,
});
