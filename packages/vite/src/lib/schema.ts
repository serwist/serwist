import { basePartial, globPartial, injectPartial, requiredGlobDirectoryPartial, requiredSwDestPartial } from "@serwist/build/schema";
import { z } from "zod";

export const hooks = z.object({
  beforeBuildServiceWorker: z.function(z.tuple([z.any()]), z.union([z.promise(z.void()), z.void()])).optional(),
  closeBundleOrder: z.union([z.literal("pre"), z.literal("post"), z.null()]).optional(),
  configureOptions: z.function(z.tuple([z.any(), z.any()]), z.union([z.promise(z.void()), z.void()])).optional(),
});

export const devOptions = z.object({
  bundle: z.boolean().default(true),
  minify: z.union([z.boolean(), z.literal("terser"), z.literal("esbuild")]).default(false),
});

export const injectManifestPartial = z.object({
  mode: z.union([z.literal("development"), z.literal("production")]),
  type: z.union([z.literal("classic"), z.literal("module")]).default("classic"),
  scope: z.string(),
  base: z.string(),
  disable: z.boolean().default(false),
  integration: hooks.default({}),
  swUrl: z.string().default("/sw.js"),
  plugins: z.array(z.any()).default([]),
  rollupFormat: z.union([z.literal("es"), z.literal("iife")]).default("es"),
  rollupOptions: z.record(z.string(), z.any()).default({}),
  devOptions: devOptions.default({}),
});

export const injectManifestOptions = basePartial
  .merge(globPartial)
  .merge(injectPartial)
  .merge(requiredSwDestPartial)
  .merge(requiredGlobDirectoryPartial)
  .merge(injectManifestPartial)
  .strict("Do not pass invalid properties to InjectManifestOptions!");
