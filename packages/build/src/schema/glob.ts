import { z } from "zod";
import type {
  GlobPartial,
  GlobResolved,
  OptionalGlobDirectoryPartial,
  OptionalGlobDirectoryResolved,
  RequiredGlobDirectoryPartial,
  RequiredGlobDirectoryResolved,
} from "../types.js";
import { DEFAULT_GLOB_PATTERNS } from "../lib/constants.js";
import { type Equals, assertType } from "./assert-type.js";

export const globPartial = z.strictObject({
  globFollow: z.boolean().default(true),
  globIgnores: z.array(z.string()).default(["**/node_modules/**/*"]),
  globPatterns: z.array(z.string()).default(DEFAULT_GLOB_PATTERNS),
  globStrict: z.boolean().default(true),
  templatedURLs: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
});

export const optionalGlobDirectoryPartial = z.strictObject({
  globDirectory: z.string().optional(),
});

// This needs to be set when using GetManifest or InjectManifest. This is
// enforced via runtime validation, and needs to be documented.
export const requiredGlobDirectoryPartial = z.strictObject({
  globDirectory: z.string(),
});

assertType<Equals<GlobPartial, z.input<typeof globPartial>>>();
assertType<Equals<GlobResolved, z.output<typeof globPartial>>>();
assertType<Equals<OptionalGlobDirectoryPartial, z.input<typeof optionalGlobDirectoryPartial>>>();
assertType<Equals<OptionalGlobDirectoryResolved, z.output<typeof optionalGlobDirectoryPartial>>>();
assertType<Equals<RequiredGlobDirectoryPartial, z.input<typeof requiredGlobDirectoryPartial>>>();
assertType<Equals<RequiredGlobDirectoryResolved, z.output<typeof requiredGlobDirectoryPartial>>>();
