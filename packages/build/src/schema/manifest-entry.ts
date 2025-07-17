import { z } from "zod";

export const manifestEntry = z.strictObject({
  integrity: z.string().optional(),
  revision: z.string().nullable().optional(),
  url: z.string(),
});
