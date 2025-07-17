import { z } from "zod";
import type { OptionalSwDestPartial, OptionalSwDestResolved, RequiredSwDestPartial, RequiredSwDestResolved } from "../types.js";
import { type Equals, assertType } from "./assert-type.js";

export const optionalSwDestPartial = z.strictObject({
  swDest: z.string().optional(),
});

export const requiredSwDestPartial = z.strictObject({
  swDest: z.string(),
});

assertType<Equals<OptionalSwDestPartial, z.input<typeof optionalSwDestPartial>>>();
assertType<Equals<OptionalSwDestResolved, z.output<typeof optionalSwDestPartial>>>();
assertType<Equals<RequiredSwDestPartial, z.input<typeof requiredSwDestPartial>>>();
assertType<Equals<RequiredSwDestResolved, z.output<typeof requiredSwDestPartial>>>();
