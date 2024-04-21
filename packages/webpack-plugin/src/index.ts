/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { InjectManifest } from "./inject-manifest.js";
import type { InjectManifestOptions, InjectManifestOptionsComplete, WebpackPartial, WebpackResolved } from "./lib/types.js";
import { validateInjectManifestOptions } from "./lib/validator.js";

export { InjectManifest, validateInjectManifestOptions };
export type { InjectManifestOptions, InjectManifestOptionsComplete, WebpackPartial, WebpackResolved };
