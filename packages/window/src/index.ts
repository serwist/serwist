/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import "./_version.js";

import { messageSW } from "./messageSW.js";
import { Serwist } from "./Serwist.js";

export { messageSW, Serwist };

// See https://github.com/GoogleChrome/workbox/issues/2770
export * from "./utils/SerwistEvent.js";
