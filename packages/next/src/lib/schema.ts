import { requiredSwDestPartial } from "@serwist/build/schema";
import { injectManifestOptions as webpackInjectManifestOptions } from "@serwist/webpack-plugin/schema";
import { z } from "zod";

export const injectPartial = z.strictObject({
  cacheOnNavigation: z.boolean().default(false),
  disable: z.boolean().default(false),
  register: z.boolean().default(true),
  reloadOnOnline: z.boolean().default(true),
  scope: z.string().optional(),
  swUrl: z.string().default("/sw.js"),
  globPublicPatterns: z.array(z.string()).default(["**/*"]),
});

export const injectManifestOptions = z
  .strictObject({
    ...webpackInjectManifestOptions.shape,
    ...requiredSwDestPartial.shape,
    ...injectPartial.shape,
  })
  .omit({ disablePrecacheManifest: true });
