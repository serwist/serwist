import { z } from "zod";

import { manifestEntry } from "./manifestEntry.js";

export const manifestTransformResult = z
  .object({
    manifest: z.array(manifestEntry.merge(z.object({ size: z.number() }))),
    warnings: z.array(z.string()).optional(),
  })
  .strict("Do not pass invalid properties to ManifestTransformResult!");

export const manifestTransform = z.function(
  z.tuple([z.array(manifestEntry.merge(z.object({ size: z.number() }))), z.unknown().optional()]),
  z.union([z.promise(manifestTransformResult), manifestTransformResult]),
);
