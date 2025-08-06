import path from "node:path";
import { assertType, type Equals, basePartial, globPartial, injectPartial } from "@serwist/build/schema";
import z from "zod";
import { DEFAULT_GLOB_PATTERNS, SUPPORTED_ESBUILD_OPTIONS } from "./lib/constants.js";
import type { InjectManifestOptions, InjectManifestOptionsComplete, TurboPartial, TurboResolved } from "./types.js";

export const turboPartial = z.strictObject({
  cwd: z.string().prefault(process.cwd()),
  basePath: z.string(),
  esbuildOptions: z.partialRecord(z.literal(SUPPORTED_ESBUILD_OPTIONS), z.any()).prefault({}),
});

export const injectManifestOptions = z
  .strictObject({
    ...basePartial.shape,
    ...globPartial.shape,
    ...injectPartial.shape,
    ...turboPartial.shape,
    globPatterns: z.array(z.string()).prefault(DEFAULT_GLOB_PATTERNS),
    globDirectory: z.string().optional(),
  })
  .omit({ disablePrecacheManifest: true })
  .transform((input) => {
    return {
      ...input,
      swSrc: path.isAbsolute(input.swSrc) ? input.swSrc : path.join(input.cwd, input.swSrc),
      globDirectory: input.globDirectory ?? input.cwd,
    };
  });

assertType<Equals<TurboPartial, z.input<typeof turboPartial>>>();
assertType<Equals<TurboResolved, z.output<typeof turboPartial>>>();
assertType<Equals<InjectManifestOptions, z.input<typeof injectManifestOptions>>>();
assertType<Equals<InjectManifestOptionsComplete, z.output<typeof injectManifestOptions>>>();
