import { z } from "zod";
import type { ManifestEntryWithSize, ManifestTransformResult } from "../types.js";
import { manifestEntryWithSize } from "./manifest-entry.js";
import { asyncFn, reference } from "./utils.js";

export const manifestTransformResult = z.strictObject({
  manifest: z.array(reference<ManifestEntryWithSize>(manifestEntryWithSize)),
  warnings: z.array(z.string()).optional(),
});

export const manifestTransform = asyncFn({
  input: [z.array(reference<ManifestEntryWithSize>(manifestEntryWithSize)), z.unknown().optional()],
  output: reference<ManifestTransformResult>(manifestTransformResult),
});
