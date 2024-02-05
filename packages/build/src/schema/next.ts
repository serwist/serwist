import { z } from "zod";
import type {
  NextInjectManifestOptions,
  NextInjectManifestOptionsComplete,
  NextInjectManifestPartial,
  NextInjectManifestResolved,
} from "../types.js";
import { type Equals, assertType } from "./assertType.js";
import { requiredSwDestPartial } from "./swDest.js";
import { webpackInjectManifestOptions } from "./webpack.js";

export const nextInjectManifestPartial = z
  .object({
    cacheOnFrontEndNav: z.boolean().default(false),
    disable: z.boolean().default(false),
    register: z.boolean().default(true),
    reloadOnOnline: z.boolean().default(true),
    scope: z.string().optional(),
    swUrl: z.string().default("/sw.js"),
    globPublicPatterns: z.union([z.string(), z.array(z.string())]).default(["**/*"]),
  })
  .strict("Do not pass invalid properties to NextInjectManifestPartial!");

export const nextInjectManifestOptions = webpackInjectManifestOptions
  .merge(requiredSwDestPartial)
  .merge(nextInjectManifestPartial)
  .omit({ disablePrecacheManifest: true })
  .strict("Do not pass invalid properties to NextInjectManifestOptions!");

assertType<Equals<NextInjectManifestPartial, z.input<typeof nextInjectManifestPartial>>>();
assertType<Equals<NextInjectManifestResolved, z.output<typeof nextInjectManifestPartial>>>();
assertType<Equals<NextInjectManifestOptions, z.input<typeof nextInjectManifestOptions>>>();
assertType<Equals<NextInjectManifestOptionsComplete, z.output<typeof nextInjectManifestOptions>>>();
