import { z } from "zod";
import type { OptionalSwDestPartial, OptionalSwDestResolved, RequiredSwDestPartial, RequiredSwDestResolved } from "../types.js";

export const optionalSwDestPartial = z
  .object({
    swDest: z.string().optional(),
  })
  .strict("Do not pass invalid properties to OptionalSwDest!") satisfies z.ZodType<OptionalSwDestResolved, z.ZodObjectDef, OptionalSwDestPartial>;

export const requiredSwDestPartial = z
  .object({
    swDest: z.string(),
  })
  .strict("Do not pass invalid properties to RequiredSwDest!") satisfies z.ZodType<RequiredSwDestResolved, z.ZodObjectDef, RequiredSwDestPartial>;
