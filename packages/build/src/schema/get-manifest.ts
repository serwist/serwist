import { z } from "zod";
import type { GetManifestOptions, GetManifestOptionsComplete } from "../types.js";
import { type Equals, assertType } from "./assert-type.js";
import { basePartial } from "./base.js";
import { globPartial, requiredGlobDirectoryPartial } from "./glob.js";

export const getManifestOptions = z.strictObject({
  ...basePartial.shape,
  ...globPartial.shape,
  ...requiredGlobDirectoryPartial.shape,
});

assertType<Equals<GetManifestOptions, z.input<typeof getManifestOptions>>>();
assertType<Equals<GetManifestOptionsComplete, z.output<typeof getManifestOptions>>>();
