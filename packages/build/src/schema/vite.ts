import type { z } from "zod";
import type { ViteInjectManifestOptions, ViteInjectManifestOptionsComplete } from "../types.js";
import { type Equals, assertType } from "./assertType.js";
import { basePartial } from "./base.js";
import { globPartial } from "./glob.js";
import { requiredGlobDirectoryPartial } from "./glob.js";
import { injectPartial } from "./injectManifest.js";
import { requiredSwDestPartial } from "./swDest.js";

export const viteInjectManifestOptions = basePartial
  .merge(globPartial)
  .merge(injectPartial)
  .merge(requiredSwDestPartial)
  .merge(requiredGlobDirectoryPartial)
  .strict("Do not pass invalid properties to ViteInjectManifestPartial!");

assertType<Equals<ViteInjectManifestOptions, z.input<typeof viteInjectManifestOptions>>>();
assertType<Equals<ViteInjectManifestOptionsComplete, z.output<typeof viteInjectManifestOptions>>>();
