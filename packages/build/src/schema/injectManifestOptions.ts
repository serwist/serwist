import { basePartial } from "./basePartial.js";
import { globPartial, requiredGlobDirectoryPartial } from "./globPartial.js";
import { injectPartial } from "./injectPartial.js";
import { requiredSwDestPartial } from "./swDestPartial.js";
import { webpackInjectManifestPartial, webpackPartial } from "./webpackPartial.js";

export const injectManifestOptions = basePartial
  .merge(globPartial)
  .merge(injectPartial)
  .merge(requiredSwDestPartial)
  .merge(requiredGlobDirectoryPartial);

export const viteInjectManifestOptions = basePartial
  .merge(globPartial)
  .merge(injectPartial)
  .merge(requiredSwDestPartial)
  .merge(requiredGlobDirectoryPartial);

export const webpackInjectManifestOptions = basePartial.merge(webpackPartial).merge(injectPartial).merge(webpackInjectManifestPartial);
