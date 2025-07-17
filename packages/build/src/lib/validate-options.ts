import { z } from "zod";
import { SerwistConfigError } from "../schema/error.js";
/*
  Copyright 2021 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { validationErrorMap } from "../schema/error.js";
import type { GetManifestOptionsComplete, InjectManifestOptionsComplete } from "../types.js";

export const validateGetManifestOptions = async (input: unknown): Promise<GetManifestOptionsComplete> => {
  const result = await (await import("../schema/get-manifest.js")).getManifestOptions.spa(input, { error: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({
      moduleName: "@serwist/build",
      message: z.prettifyError(result.error),
    });
  }
  return result.data;
};

export const validateInjectManifestOptions = async (input: unknown): Promise<InjectManifestOptionsComplete> => {
  const result = await (await import("../schema/inject-manifest.js")).injectManifestOptions.spa(input, { error: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({
      moduleName: "@serwist/build",
      message: z.prettifyError(result.error),
    });
  }
  return result.data;
};
