import { SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import { z } from "zod";
import { injectManifestOptions } from "./schema.js";
import type { InjectManifestOptionsComplete } from "./types.js";

export const validateInjectManifestOptions = (input: unknown): InjectManifestOptionsComplete => {
  const result = injectManifestOptions.safeParse(input, {
    error: validationErrorMap,
  });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "@serwist/next", message: z.prettifyError(result.error) });
  }
  return result.data;
};
