/*
  Copyright 2021 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { betterAjvErrors } from "@apideck/better-ajv-errors";
import type { JSONSchemaType } from "ajv";
import Ajv from "ajv";
import { oneLine as ol } from "common-tags";

import type {
  GetManifestOptions,
  InjectManifestOptions,
  MethodNames,
  WebpackInjectManifestOptions,
} from "../types.js";
import { errors } from "./errors.js";
import { optionsSchemas } from "../schema/index.js";

const ajv = new (Ajv as unknown as typeof Ajv.default)({
  useDefaults: true,
});

const DEFAULT_EXCLUDE_VALUE = [/\.map$/, /^manifest.*\.js$/];

export class SerwistConfigError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Some methods need to do follow-up validation using the JSON schema,
// so return both the validated options and then schema.
function validate<T>(
  input: unknown,
  methodName: MethodNames
): [T, JSONSchemaType<T>] {
  // Don't mutate input: https://github.com/GoogleChrome/workbox/issues/2158
  const inputCopy = Object.assign({}, input);
  const jsonSchema = optionsSchemas[methodName] as unknown as JSONSchemaType<T>;
  const validate = ajv.compile(jsonSchema);
  if (validate(inputCopy)) {
    // All methods support manifestTransforms, so validate it here.
    ensureValidManifestTransforms(inputCopy as any);
    return [inputCopy, jsonSchema];
  }

  const betterErrors = betterAjvErrors({
    basePath: methodName,
    data: input,
    errors: validate.errors,
    // This is needed as JSONSchema6 is expected, but JSONSchemaType works.
    // eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment
    schema: jsonSchema as any,
  });
  const messages = betterErrors.map(
    (err) => ol`[${err.path}] ${err.message}.
    ${err.suggestion ? err.suggestion : ""}`
  );

  throw new SerwistConfigError(messages.join("\n\n"));
}

function ensureValidManifestTransforms(
  options:
    | GetManifestOptions
    | InjectManifestOptions
    | WebpackInjectManifestOptions
): void {
  if (
    "manifestTransforms" in options &&
    !(
      Array.isArray(options.manifestTransforms) &&
      options.manifestTransforms.every((item) => typeof item === "function")
    )
  ) {
    throw new SerwistConfigError(errors["manifest-transforms"]);
  }
}

export function validateGetManifestOptions(input: unknown): GetManifestOptions {
  const [validatedOptions] = validate<GetManifestOptions>(input, "GetManifest");

  return validatedOptions;
}

export function validateInjectManifestOptions(
  input: unknown
): InjectManifestOptions {
  const [validatedOptions] = validate<InjectManifestOptions>(
    input,
    "InjectManifest"
  );

  return validatedOptions;
}

export function validateWebpackInjectManifestOptions(
  input: unknown
): WebpackInjectManifestOptions {
  const inputWithExcludeDefault = Object.assign(
    {
      // Make a copy, as exclude can be mutated when used.
      exclude: Array.from(DEFAULT_EXCLUDE_VALUE),
    },
    input
  );
  const [validatedOptions] = validate<WebpackInjectManifestOptions>(
    inputWithExcludeDefault,
    "WebpackInjectManifest"
  );

  return validatedOptions;
}
