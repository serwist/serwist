import { z } from "zod";
import { manifestEntry } from "./manifest-entry.js";
import { asyncFn } from "./utils.js";

const sizeObject = z.object({ size: z.number() });

const manifestEntryWithSize = z.object({ ...manifestEntry.shape, ...sizeObject.shape });

export const manifestTransformResult = z.strictObject({
  manifest: z.array(manifestEntryWithSize),
  warnings: z.array(z.string()).optional(),
});

export const manifestTransform = asyncFn({
  input: [z.array(manifestEntryWithSize), z.unknown().optional()],
  output: manifestTransformResult,
});
