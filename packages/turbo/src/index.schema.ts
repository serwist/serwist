import path from "node:path";
import { basePartial, globPartial, injectPartial } from "@serwist/build/schema";
import z from "zod";
import { DEFAULT_GLOB_PATTERNS } from "./lib/constants.js";

export const injectManifestOptions = z
  .strictObject({
    ...basePartial.shape,
    ...globPartial.shape,
    ...injectPartial.shape,
    cwd: z.string().prefault(process.cwd()),
    basePath: z.string(),
    globPatterns: z.array(z.string()).prefault(DEFAULT_GLOB_PATTERNS),
    globDirectory: z.string().optional(),
  })
  .transform((input) => {
    return {
      ...input,
      swSrc: path.isAbsolute(input.swSrc) ? input.swSrc : path.join(input.cwd, input.swSrc),
      globDirectory: input.globDirectory ?? input.cwd,
    };
  });
