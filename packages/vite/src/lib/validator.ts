import { SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import { z } from "zod";
import type { PluginOptionsValidated } from "./types.js";

export const validateInjectManifestOptions = async (input: unknown): Promise<PluginOptionsValidated> => {
  const result = await (await import("./schema.js")).injectManifestOptions.spa(input, { error: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "vite-plugin-serwist", message: z.prettifyError(result.error) });
  }
  return result.data;
};
