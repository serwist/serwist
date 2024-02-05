import { z } from "zod";

import type { BasePartial, BaseResolved } from "../types.js";
import { type Equals, assertType } from "./assertType.js";
import { manifestEntry } from "./manifestEntry.js";
import { manifestTransform } from "./manifestTransform.js";

export const basePartial = z
  .object({
    additionalPrecacheEntries: z.array(z.union([z.string(), manifestEntry])).optional(),
    disablePrecacheManifest: z.boolean().default(false),
    dontCacheBustURLsMatching: z.instanceof(RegExp).optional(),
    manifestTransforms: z.array(manifestTransform).optional(),
    maximumFileSizeToCacheInBytes: z.number().default(2097152),
    modifyURLPrefix: z.record(z.string(), z.string()).optional(),
  })
  .strict("Do not pass invalid properties to BasePartial!");

assertType<Equals<BasePartial, z.input<typeof basePartial>>>();
assertType<Equals<BaseResolved, z.output<typeof basePartial>>>();
