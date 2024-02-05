import { z } from "zod";
import type {
  GlobPartial,
  GlobResolved,
  OptionalGlobDirectoryPartial,
  OptionalGlobDirectoryResolved,
  RequiredGlobDirectoryPartial,
  RequiredGlobDirectoryResolved,
} from "../types.js";

export const globPartial = z
  .object({
    globFollow: z.boolean().default(true),
    globIgnores: z.array(z.string()).default(["**/node_modules/**/*"]),
    globPatterns: z.array(z.string()).default(["**/*.{js,css,html}"]),
    globStrict: z.boolean().default(true),
    templatedURLs: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  })
  .strict("Do not pass invalid properties to GlobPartial!") satisfies z.ZodType<GlobResolved, z.ZodObjectDef, GlobPartial>;

export const optionalGlobDirectoryPartial = z
  .object({
    globDirectory: z.string().optional(),
  })
  .strict("Do not pass invalid properties to OptionalGlobDirectoryPartial!") satisfies z.ZodType<
  OptionalGlobDirectoryResolved,
  z.ZodObjectDef,
  OptionalGlobDirectoryPartial
>;

// This needs to be set when using GetManifest or InjectManifest. This is
// enforced via runtime validation, and needs to be documented.
export const requiredGlobDirectoryPartial = z
  .object({
    globDirectory: z.string(),
  })
  .strict("Do not pass invalid properties to RequiredGlobDirectoryPartial!") satisfies z.ZodType<
  RequiredGlobDirectoryResolved,
  z.ZodObjectDef,
  RequiredGlobDirectoryPartial
>;
