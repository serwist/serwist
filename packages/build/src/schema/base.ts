import { z } from "zod";
import type { BasePartial, BaseResolved, ManifestEntry, ManifestTransform } from "../types.js";
import { assertType, type Equals } from "./assert-type.js";
import { manifestEntry } from "./manifest-entry.js";
import { manifestTransform } from "./manifest-transform.js";
import { reference } from "./utils.js";

export const basePartial = z.strictObject({
  additionalPrecacheEntries: z.array(z.union([z.string(), reference<ManifestEntry>(manifestEntry)])).optional(),
  disablePrecacheManifest: z.boolean().default(false),
  dontCacheBustURLsMatching: z.instanceof(RegExp).optional(),
  manifestTransforms: z.array(reference<ManifestTransform>(manifestTransform)).optional(),
  maximumFileSizeToCacheInBytes: z.number().default(2097152),
  modifyURLPrefix: z.record(z.string(), z.string()).optional(),
});

assertType<Equals<BasePartial, z.input<typeof basePartial>>>();
assertType<Equals<BaseResolved, z.output<typeof basePartial>>>();
