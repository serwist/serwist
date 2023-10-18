/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { GenerateSW, type GenerateSWConfig } from "./generate-sw.js";
import { InjectManifest } from "./inject-manifest.js";

/**
 * @module workbox-webpack-plugin
 */
export { GenerateSW, InjectManifest };

export type { GenerateSWConfig };

// TODO: remove this in v7.
// See https://github.com/GoogleChrome/workbox/issues/3033
export default { GenerateSW, InjectManifest };
