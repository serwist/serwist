import { assertType, injectPartial as baseInjectPartial, basePartial, type Equals, fn, optionalSwDestPartial } from "@serwist/build/schema";
import { z } from "zod";
import type {
  InjectManifestOptions,
  InjectManifestOptionsComplete,
  InjectPartial,
  InjectResolved,
  WebpackPartial,
  WebpackResolved,
} from "./types.js";

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
  ...optionalSwDestPartial.shape,
  compileSrc: z.boolean().default(true),
  webpackCompilationPlugins: z.array(z.any()).optional(),
});

export const injectManifestOptions = z.strictObject({
  ...basePartial.shape,
  ...webpackPartial.shape,
  ...baseInjectPartial.shape,
  ...optionalSwDestPartial.shape,
  ...injectPartial.shape,
});

assertType<Equals<WebpackPartial, z.input<typeof webpackPartial>>>();
assertType<Equals<WebpackResolved, z.output<typeof webpackPartial>>>();
assertType<Equals<InjectPartial, z.input<typeof injectPartial>>>();
assertType<Equals<InjectResolved, z.output<typeof injectPartial>>>();
assertType<Equals<InjectManifestOptions, z.input<typeof injectManifestOptions>>>();
assertType<Equals<InjectManifestOptionsComplete, z.output<typeof injectManifestOptions>>>();
