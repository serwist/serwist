import { asyncFn, basePartial, fn, globPartial, injectPartial, requiredGlobDirectoryPartial, requiredSwDestPartial } from "@serwist/build/schema";
import { z } from "zod";
import type { PluginOptionsValidated } from "./types.js";

export const hooks = z.strictObject({
  beforeBuildServiceWorker: z
    .union([
      fn({
        input: [z.any()],
        output: z.void(),
      }),
      asyncFn({
        input: [z.any()],
        output: z.void(),
      }),
    ])
    .optional(),
  closeBundleOrder: z.union([z.literal("pre"), z.literal("post"), z.null()]).optional(),
  configureOptions: z
    .union([
      fn({
        input: [z.any(), z.any()],
        output: z.void(),
      }),
      asyncFn({
        input: [z.any(), z.any()],
        output: z.void(),
      }),
    ])
    .optional(),
});

export const devOptions = z.strictObject({
  bundle: z.boolean().default(true),
  minify: z.union([z.boolean(), z.literal("terser"), z.literal("esbuild")]).default(false),
});

export const injectManifestPartial = z.strictObject({
  // plugins: z.array(z.any()).prefault([]),
  // rollupFormat: z.literal(["es", "iife"]).prefault("es"),
  // devOptions: devOptions.prefault({}),
  disable: z.boolean().prefault(false),
  type: z.literal(["classic", "module"]).prefault("classic"),
  scope: z.string(),
  base: z.string(),
  swUrl: z.string().prefault("/sw.js"),
  integration: hooks.prefault({}),
  rolldownOptions: z.record(z.string(), z.any()).prefault({}),
});

export const injectManifestOptions = z
  .strictObject({
    ...basePartial.shape,
    ...globPartial.shape,
    ...injectPartial.shape,
    ...requiredSwDestPartial.shape,
    ...requiredGlobDirectoryPartial.shape,
    ...injectManifestPartial.shape,
  })
  .omit({ disablePrecacheManifest: true })
  .transform(
    ({ disable, type, scope, base, swUrl, integration, rolldownOptions, ...injectManifest }): PluginOptionsValidated => ({
      disable,
      type,
      scope,
      base,
      swUrl,
      integration,
      rolldownOptions,
      injectManifest,
    }),
  );
