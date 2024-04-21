import { z } from "zod";
import type { OptionalSwDestPartial, OptionalSwDestResolved, RequiredSwDestPartial, RequiredSwDestResolved } from "../types.js";
import { type Equals, assertType } from "./assertType.js";

export const optionalSwDestPartial = z
  .object({
    swDest: z.string().optional(),
  })
  .strict("Do not pass invalid properties to OptionalSwDest!");

export const requiredSwDestPartial = z
  .object({
    swDest: z.string(),
  })
  .strict("Do not pass invalid properties to RequiredSwDest!");

assertType<Equals<OptionalSwDestPartial, z.input<typeof optionalSwDestPartial>>>();
assertType<Equals<OptionalSwDestResolved, z.output<typeof optionalSwDestPartial>>>();
assertType<Equals<RequiredSwDestPartial, z.input<typeof requiredSwDestPartial>>>();
assertType<Equals<RequiredSwDestResolved, z.output<typeof requiredSwDestPartial>>>();
