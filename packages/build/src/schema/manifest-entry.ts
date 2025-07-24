import { z } from "zod";

export const manifestEntry = z.strictObject({
  integrity: z.string().optional(),
  revision: z.string().nullable().optional(),
  url: z.string(),
});

export const sizeObject = z.object({ size: z.number() });

export const manifestEntryWithSize = z.object({ ...manifestEntry.shape, ...sizeObject.shape });
