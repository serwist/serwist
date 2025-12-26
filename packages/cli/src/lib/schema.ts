import { injectManifestOptions } from "@serwist/build/schema";
import z from "zod";
import { SUPPORTED_ESBUILD_OPTIONS } from "./constants.js";

export const buildPartial = z.strictObject({
  esbuildOptions: z.partialRecord(z.literal(SUPPORTED_ESBUILD_OPTIONS), z.any()).prefault({}),
});

export const buildOptions = z.strictObject({
  ...injectManifestOptions.shape,
  ...buildPartial.shape,
});
