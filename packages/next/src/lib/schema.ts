import { requiredSwDestPartial } from "@serwist/build/schema";
import { injectManifestOptions as webpackInjectManifestOptions } from "@serwist/webpack-plugin/schema";
import { z } from "zod";

export const injectPartial = z
  .object({
    cacheOnNavigation: z.boolean().default(false),
    disable: z.boolean().default(false),
    register: z.boolean().default(true),
    reloadOnOnline: z.boolean().default(true),
    scope: z.string().optional(),
    swUrl: z.string().default("/sw.js"),
    globPublicPatterns: z.array(z.string()).default(["**/*"]),
  })
  .strict("Do not pass invalid properties to NextInjectManifestPartial!");

export const injectManifestOptions = webpackInjectManifestOptions
  .merge(requiredSwDestPartial)
  .merge(injectPartial)
  .omit({ disablePrecacheManifest: true })
  .strict("Do not pass invalid properties to NextInjectManifestOptions!");
