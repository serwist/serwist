import { z } from "zod";

export const manifestEntry = z
  .object({
    integrity: z.string().optional(),
    revision: z.string().nullable().optional(),
    url: z.string(),
  })
  .strict("Do not pass invalid properties to ManifestEntry!");
