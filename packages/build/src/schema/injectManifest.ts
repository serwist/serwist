import { z } from "zod";
import type { InjectManifestOptions, InjectManifestOptionsComplete, InjectPartial, InjectResolved } from "../types.js";
import { type Equals, assertType } from "./assertType.js";
import { basePartial } from "./base.js";
import { globPartial, requiredGlobDirectoryPartial } from "./glob.js";
import { requiredSwDestPartial } from "./swDest.js";

export const injectPartial = z
  .object({
    injectionPoint: z.string().default("self.__SW_MANIFEST"),
    swSrc: z.string(),
  })
  .strict("Do not pass invalid properties to InjectPartial!");

export const injectManifestOptions = basePartial
  .merge(globPartial)
  .merge(injectPartial)
  .merge(requiredSwDestPartial)
  .merge(requiredGlobDirectoryPartial)
  .strict("Do not pass invalid properties to InjectManifestOptions!");

assertType<Equals<InjectPartial, z.input<typeof injectPartial>>>();
assertType<Equals<InjectResolved, z.output<typeof injectPartial>>>();
assertType<Equals<InjectManifestOptions, z.input<typeof injectManifestOptions>>>();
assertType<Equals<InjectManifestOptionsComplete, z.output<typeof injectManifestOptions>>>();
