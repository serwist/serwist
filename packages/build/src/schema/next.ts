import { z } from "zod";
import type {
  NextInjectManifestOptions,
  NextInjectManifestOptionsComplete,
  NextInjectManifestPartial,
  NextInjectManifestResolved,
} from "../types.js";
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
    globPublicPatterns: z.array(z.string()).default(["**/*"]),
  })
  .strict("Do not pass invalid properties to NextInjectManifestPartial!") satisfies z.ZodType<
  NextInjectManifestResolved,
  z.ZodObjectDef,
  NextInjectManifestPartial
>;

export const nextInjectManifestOptions = webpackInjectManifestOptions
  .merge(requiredSwDestPartial)
  .merge(nextInjectManifestPartial)
  .omit({ disablePrecacheManifest: true })
  .strict("Do not pass invalid properties to NextInjectManifestOptions!") satisfies z.ZodType<
  NextInjectManifestOptionsComplete,
  z.ZodObjectDef,
  NextInjectManifestOptions
>;
