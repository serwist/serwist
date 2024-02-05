import { z } from "zod";
import type { InjectManifestOptions, InjectManifestOptionsComplete, InjectPartial, InjectResolved } from "../types.js";
import { basePartial } from "./base.js";
import { globPartial, requiredGlobDirectoryPartial } from "./glob.js";
import { requiredSwDestPartial } from "./swDest.js";

export const injectPartial = z
  .object({
    injectionPoint: z.string().default("self.__SW_MANIFEST"),
    swSrc: z.string(),
  })
  .strict("Do not pass invalid properties to InjectPartial!") satisfies z.ZodType<InjectResolved, z.ZodObjectDef, InjectPartial>;

export const injectManifestOptions = basePartial
  .merge(globPartial)
  .merge(injectPartial)
  .merge(requiredSwDestPartial)
  .merge(requiredGlobDirectoryPartial)
  .strict("Do not pass invalid properties to InjectManifestOptions!") satisfies z.ZodType<
  InjectManifestOptionsComplete,
  z.ZodObjectDef,
  InjectManifestOptions
>;
