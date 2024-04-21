import { SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import type { InjectManifestOptionsComplete } from "./types.js";

export const validateInjectManifestOptions = async (input: unknown): Promise<InjectManifestOptionsComplete> => {
  const result = await (await import("./schema.js")).injectManifestOptions.spa(input, { errorMap: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "@serwist/webpack-plugin", message: JSON.stringify(result.error.format(), null, 2) });
  }
  return result.data;
};
