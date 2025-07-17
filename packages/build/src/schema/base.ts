import { z } from "zod";

import type { BasePartial, BaseResolved } from "../types.js";
import { type Equals, assertType } from "./assert-type.js";
import { manifestEntry } from "./manifest-entry.js";
import { manifestTransform } from "./manifest-transform.js";

export const basePartial = z.strictObject({
  additionalPrecacheEntries: z.array(z.union([z.string(), manifestEntry])).optional(),
  disablePrecacheManifest: z.boolean().default(false),
  dontCacheBustURLsMatching: z.instanceof(RegExp).optional(),
  manifestTransforms: z.array(manifestTransform).optional(),
  maximumFileSizeToCacheInBytes: z.number().default(2097152),
  modifyURLPrefix: z.record(z.string(), z.string()).optional(),
});

assertType<Equals<BasePartial, z.input<typeof basePartial>>>();
assertType<Equals<BaseResolved, z.output<typeof basePartial>>>();
