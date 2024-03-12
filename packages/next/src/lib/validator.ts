import { SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import { injectManifestOptions } from "./schema.js";
import type { InjectManifestOptionsComplete } from "./types.js";

export const validateInjectManifestOptions = (input: unknown): InjectManifestOptionsComplete => {
  const result = injectManifestOptions.safeParse(input, {
    errorMap: validationErrorMap,
  });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "@serwist/next", message: JSON.stringify(result.error.format(), null, 2) });
  }
  return result.data;
};
