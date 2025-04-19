import { SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import type { InjectManifestOptionsComplete } from "../types.js";

const schema = import("./schema.js");

export const validateInjectManifestOptions = async (input: unknown): Promise<InjectManifestOptionsComplete> => {
  const result = await (await schema).injectManifestOptions.spa(input, { errorMap: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "@serwist/react-router", message: JSON.stringify(result.error.format(), null, 2) });
  }
  return result.data;
};
