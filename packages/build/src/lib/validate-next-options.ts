import { nextInjectManifestOptions } from "../schema/next.js";
import { validationErrorMap } from "../schema/validationErrorMap.js";
import type { NextInjectManifestOptionsComplete } from "../types.js";
import { SerwistConfigError } from "./serwist-config-error.js";

export const validateNextInjectManifestOptions = (input: unknown): NextInjectManifestOptionsComplete => {
  const result = nextInjectManifestOptions.safeParse(input, {
    errorMap: validationErrorMap,
  });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "@serwist/next", message: JSON.stringify(result.error.format(), null, 2) });
  }
  return result.data;
};
