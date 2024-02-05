import type { z } from "zod";

import type { GetManifestOptions, GetManifestOptionsComplete } from "../types.js";
import { basePartial } from "./base.js";
import { globPartial, requiredGlobDirectoryPartial } from "./glob.js";

export const getManifestOptions = basePartial
  .merge(globPartial)
  .merge(requiredGlobDirectoryPartial)
  .strict("Do not pass invalid properties to GetManifestOptions!") satisfies z.ZodType<
  GetManifestOptionsComplete,
  z.ZodObjectDef,
  GetManifestOptions
>;
