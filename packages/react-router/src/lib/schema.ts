import { basePartial, globPartial, injectPartial, requiredGlobDirectoryPartial, requiredSwDestPartial } from "@serwist/build/schema";

export const injectManifestOptions = basePartial
  .merge(globPartial)
  .merge(injectPartial)
  .merge(requiredSwDestPartial)
  .merge(requiredGlobDirectoryPartial)
  .strict("Do not pass invalid properties to InjectManifestOptions!");
