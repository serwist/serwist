/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { concatenate } from "./concatenate.js";
import { concatenateToResponse } from "./concatenateToResponse.js";
import { isSupported } from "./isSupported.js";
import type { StreamsHandlerCallback } from "./strategy.js";
import { strategy } from "./strategy.js";

export { concatenate, concatenateToResponse, isSupported, strategy };

export type { StreamsHandlerCallback };

export * from "./_types.js";
