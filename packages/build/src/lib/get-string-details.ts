/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import type { FileDetails } from "../types.js";
import { getStringHash } from "./get-string-hash.js";

export const getStringDetails = (url: string, str: string): FileDetails => ({
  file: url,
  hash: getStringHash(str),
  size: str.length,
});
