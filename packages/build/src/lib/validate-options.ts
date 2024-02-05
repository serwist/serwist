/*
  Copyright 2021 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
import { validationErrorMap } from "../schema/validationErrorMap.js";
import type {
  GetManifestOptionsComplete,
  InjectManifestOptionsComplete,
  ViteInjectManifestOptionsComplete,
  WebpackInjectManifestOptionsComplete,
} from "../types.js";
import { SerwistConfigError } from "./serwist-config-error.js";

export const validateGetManifestOptions = async (input: unknown): Promise<GetManifestOptionsComplete> => {
  const result = await (await import("../schema/getManifest.js")).getManifestOptions.spa(input, { errorMap: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "@serwist/build", message: JSON.stringify(result.error.format(), null, 2) });
  }
  return result.data;
};

export const validateInjectManifestOptions = async (input: unknown): Promise<InjectManifestOptionsComplete> => {
  const result = await (await import("../schema/injectManifest.js")).injectManifestOptions.spa(input, { errorMap: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "@serwist/build", message: JSON.stringify(result.error.format(), null, 2) });
  }
  return result.data;
};

export const validateWebpackInjectManifestOptions = async (input: unknown): Promise<WebpackInjectManifestOptionsComplete> => {
  const result = await (await import("../schema/webpack.js")).webpackInjectManifestOptions.spa(input, { errorMap: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "@serwist/webpack-plugin", message: JSON.stringify(result.error.format(), null, 2) });
  }
  return result.data;
};

export const validateViteInjectManifestOptions = async (input: unknown): Promise<ViteInjectManifestOptionsComplete> => {
  const result = await (await import("../schema/vite.js")).viteInjectManifestOptions.spa(input, { errorMap: validationErrorMap });
  if (!result.success) {
    throw new SerwistConfigError({ moduleName: "@serwist/vite", message: JSON.stringify(result.error.format(), null, 2) });
  }
  return result.data;
};
