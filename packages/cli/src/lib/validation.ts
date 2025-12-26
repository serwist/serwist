import { SerwistConfigError, validationErrorMap } from "@serwist/build/schema";
import z from "zod";
import type { BuildOptionsComplete } from "../types.js";

export const validateBuildOptions = async (input: unknown): Promise<BuildOptionsComplete> => {
  const result = await (await import("./schema.js")).buildOptions.spa(input, { error: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({
      moduleName: "@serwist/cli",
      message: z.prettifyError(result.error),
    });
  }
  return result.data;
};
