import { z } from "zod";
import type { InjectManifestOptions, InjectManifestOptionsComplete, InjectPartial, InjectResolved } from "../types.js";
import { assertType, type Equals } from "./assert-type.js";
import { basePartial } from "./base.js";
import { globPartial, requiredGlobDirectoryPartial } from "./glob.js";
import { requiredSwDestPartial } from "./sw-dest.js";

export const baseInjectPartial = z.strictObject({
  injectionPoint: z.string().default("self.__SW_MANIFEST"),
  swSrc: z.string(),
});

export const injectManifestOptions = z.strictObject({
  ...basePartial.shape,
  ...globPartial.shape,
  ...baseInjectPartial.shape,
  ...requiredSwDestPartial.shape,
  ...requiredGlobDirectoryPartial.shape,
});

assertType<Equals<InjectPartial, z.input<typeof baseInjectPartial>>>();
assertType<Equals<InjectResolved, z.output<typeof baseInjectPartial>>>();
assertType<Equals<InjectManifestOptions, z.input<typeof injectManifestOptions>>>();
assertType<Equals<InjectManifestOptionsComplete, z.output<typeof injectManifestOptions>>>();
