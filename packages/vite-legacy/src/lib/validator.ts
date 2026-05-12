import { SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import { z } from "zod";
import type { InjectManifestOptionsComplete } from "./types.js";

export const validateInjectManifestOptions = async (input: unknown): Promise<InjectManifestOptionsComplete> => {
  const result = await (await import("./schema.js")).injectManifestOptions.spa(input, { error: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "@serwist/vite", message: z.prettifyError(result.error) });
  }
  return result.data;
};
