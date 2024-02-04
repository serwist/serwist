/*
  Copyright 2021 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { validationErrorMap } from "../schema/validationErrorMap.js";
import type { GetManifestOptions, InjectManifestOptions, ViteInjectManifestOptions, WebpackInjectManifestOptions } from "../types.js";

export class SerwistConfigError extends Error {
  constructor(message?: string) {
    super(`Received an invalid Serwist configuration: ${message}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const validateGetManifestOptions = async (input: unknown): Promise<GetManifestOptions> => {
  const result = await (await import("../schema/getManifestOptions.js")).getManifestOptions.spa(input, { errorMap: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError(JSON.stringify(result.error.format(), null, 2));
  }
  return result.data;
};

export const validateInjectManifestOptions = async (input: unknown): Promise<InjectManifestOptions> => {
  const result = await (await import("../schema/injectManifestOptions.js")).injectManifestOptions.spa(input, { errorMap: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError(JSON.stringify(result.error.format(), null, 2));
  }
  return result.data;
};

export const validateWebpackInjectManifestOptions = async (input: unknown): Promise<WebpackInjectManifestOptions> => {
  const result = await (await import("../schema/injectManifestOptions.js")).webpackInjectManifestOptions.spa(input, { errorMap: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError(JSON.stringify(result.error.format(), null, 2));
  }
  return result.data;
};

export const validateViteInjectManifestOptions = async (input: unknown): Promise<ViteInjectManifestOptions> => {
  const result = await (await import("../schema/injectManifestOptions.js")).viteInjectManifestOptions.spa(input, { errorMap: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError(JSON.stringify(result.error.format(), null, 2));
  }
  return result.data;
};
