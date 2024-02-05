import { z } from "zod";
import type {
  GlobPartial,
  GlobResolved,
  OptionalGlobDirectoryPartial,
  OptionalGlobDirectoryResolved,
  RequiredGlobDirectoryPartial,
  RequiredGlobDirectoryResolved,
} from "../types.js";
import { type Equals, assertType } from "./assertType.js";

export const globPartial = z
  .object({
    globFollow: z.boolean().default(true),
    globIgnores: z.array(z.string()).default(["**/node_modules/**/*"]),
    globPatterns: z.array(z.string()).default(["**/*.{js,css,html}"]),
    globStrict: z.boolean().default(true),
    templatedURLs: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  })
  .strict("Do not pass invalid properties to GlobPartial!");

export const optionalGlobDirectoryPartial = z
  .object({
    globDirectory: z.string().optional(),
  })
  .strict("Do not pass invalid properties to OptionalGlobDirectoryPartial!");

// This needs to be set when using GetManifest or InjectManifest. This is
// enforced via runtime validation, and needs to be documented.
export const requiredGlobDirectoryPartial = z
  .object({
    globDirectory: z.string(),
  })
  .strict("Do not pass invalid properties to RequiredGlobDirectoryPartial!");

assertType<Equals<GlobPartial, z.input<typeof globPartial>>>();
assertType<Equals<GlobResolved, z.output<typeof globPartial>>>();
assertType<Equals<OptionalGlobDirectoryPartial, z.input<typeof optionalGlobDirectoryPartial>>>();
assertType<Equals<OptionalGlobDirectoryResolved, z.output<typeof optionalGlobDirectoryPartial>>>();
assertType<Equals<RequiredGlobDirectoryPartial, z.input<typeof requiredGlobDirectoryPartial>>>();
assertType<Equals<RequiredGlobDirectoryResolved, z.output<typeof requiredGlobDirectoryPartial>>>();
