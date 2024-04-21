/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { readFileSync } from "node:fs";

import { errors } from "./errors.js";
import { getStringHash } from "./get-string-hash.js";

export const getFileHash = (file: string): string => {
  try {
    const buffer = readFileSync(file);
    return getStringHash(buffer);
  } catch (err) {
    throw new Error(`${errors["unable-to-get-file-hash"]} '${err instanceof Error && err.message ? err.message : ""}'`);
  }
};
