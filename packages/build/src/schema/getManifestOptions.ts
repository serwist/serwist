import { basePartial } from "./basePartial.js";
import { globPartial, requiredGlobDirectoryPartial } from "./globPartial.js";

export const getManifestOptions = basePartial.merge(globPartial).merge(requiredGlobDirectoryPartial);
